"""FastAPI backend for LLM Council."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
import json
import asyncio

from . import storage
from .council import run_full_council, generate_conversation_title, stage1_collect_responses, stage2_collect_rankings, stage3_synthesize_final, calculate_aggregate_rankings

app = FastAPI(title="LLM Council API")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    # Open for local dev to avoid CORS headaches; tighten for prod.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store ongoing processes in memory (in production, you'd use Redis or similar)
ongoing_processes = {}


class CreateConversationRequest(BaseModel):
    """Request to create a new conversation."""
    pass


class SendMessageRequest(BaseModel):
    """Request to send a message in a conversation."""
    content: str


class AskRequest(BaseModel):
    """Simplified single-turn ask request used by the React frontend."""
    question: str


class FeedbackRequest(BaseModel):
    """Lightweight feedback payload from the frontend."""
    turn_id: int
    label: str


class ConversationMetadata(BaseModel):
    """Conversation metadata for list view."""
    id: str
    created_at: str
    title: str
    message_count: int


class Conversation(BaseModel):
    """Full conversation with all messages."""
    id: str
    created_at: str
    title: str
    messages: List[Dict[str, Any]]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "LLM Council API"}


@app.get("/api/conversations", response_model=List[ConversationMetadata])
async def list_conversations():
    """List all conversations (metadata only)."""
    return storage.list_conversations()


@app.post("/api/conversations", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """Create a new conversation."""
    conversation_id = str(uuid.uuid4())
    conversation = storage.create_conversation(conversation_id)
    return conversation


@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation with all its messages."""
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@app.post("/api/conversations/{conversation_id}/message")
async def send_message(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and run the 3-stage council process.
    Returns the complete response with all stages.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    # Add user message
    storage.add_user_message(conversation_id, request.content)

    # If this is the first message, generate a title
    if is_first_message:
        title = await generate_conversation_title(request.content)
        storage.update_conversation_title(conversation_id, title)

    # Run the 3-stage council process
    stage1_results, stage2_results, stage3_result, metadata = await run_full_council(
        request.content
    )

    # Add assistant message with all stages
    storage.add_assistant_message(
        conversation_id,
        stage1_results,
        stage2_results,
        stage3_result
    )

    # Return the complete response with metadata
    return {
        "stage1": stage1_results,
        "stage2": stage2_results,
        "stage3": stage3_result,
        "metadata": metadata
    }

@app.post("/api/ask")
async def ask_question(request: AskRequest):
    """
    Convenience endpoint for the React app.
    Runs a single-turn council and returns a UI-friendly payload.
    """
    stage1_results, stage2_results, stage3_result, metadata = await run_full_council(
        request.question
    )

    if not stage1_results:
        raise HTTPException(
            status_code=503,
            detail="All council models failed to respond. Check your API key or model availability.",
        )

    aggregate_rankings = metadata.get("aggregate_rankings", [])

    def _clean_text(text: str) -> str:
        # Strip common stop tokens that some models return (</s>, [/s>, etc.)
        if not isinstance(text, str):
            return ""
        return text.replace("</s>", "").replace("[/s>", "").strip()

    # Prefer the order of stage1_results (what actually returned), keep unique
    ordered_models = []
    for r in stage1_results:
        m = r.get("model")
        if m and m not in ordered_models:
            ordered_models.append(m)

    # If aggregate rankings exist, use them but preserve uniqueness
    ranked_models = [item["model"] for item in aggregate_rankings if item.get("model")]
    top_two = ranked_models[:2] if len(ranked_models) >= 2 else ordered_models[:2]

    def build_agent(model_name: str) -> Dict[str, Any]:
        stage1_entry = next((r for r in stage1_results if r["model"] == model_name), {})
        resp = _clean_text(stage1_entry.get("response", ""))
        return {
            "model": model_name,
            "answer": resp,
            # No explicit reasoning per model; reuse cleaned response
            "reasoning": resp,
            "raw_output": resp,
        }

    # Ensure two agents; if only one, duplicate to keep UI stable
    if len(top_two) == 1 and stage1_results:
        top_two.append(top_two[0])

    agent_a_model = top_two[0]
    agent_b_model = top_two[1] if len(top_two) > 1 else top_two[0]

    agent_a = build_agent(agent_a_model)
    agent_b = build_agent(agent_b_model)

    # Determine winner based on aggregate rankings (lowest average rank wins)
    winner_model = aggregate_rankings[0]["model"] if aggregate_rankings else agent_a_model
    chosen_agent = "agent_a" if winner_model == agent_a_model else "agent_b"

    # Lightweight scoring derived from ranking position (not absolute accuracy)
    def score_for_model(model_name: str) -> float:
        entry = next((item for item in aggregate_rankings if item["model"] == model_name), None)
        if not entry:
            return 8.0
        # Map average rank to a 1-10 scale: rank 1 -> 9.5, rank 2 -> 8, rank 3 -> 6.5, etc.
        return max(1.0, 10.5 - (entry["average_rank"] * 1.5))

    referee_scores = {
        "correctness": round(score_for_model(winner_model), 1),
        "clarity": round(score_for_model(winner_model) - 0.5, 1),
        "usefulness": round(score_for_model(winner_model) - 0.2, 1),
    }

    referee_critique = _clean_text(
        stage2_results[0]["ranking"]
        if stage2_results
        else "Ranking information unavailable; using fallback winner selection."
    )

    # If final synthesis failed, fall back to the chosen agent's answer
    final_answer = stage3_result.get("response", "")
    if not final_answer or "Unable to generate final synthesis" in final_answer:
        final_answer = agent_a["answer"] if chosen_agent == "agent_a" else agent_b["answer"]
    final_answer = _clean_text(final_answer)

    response_payload = {
        "turn_id": 0,
        "question": request.question,
        "agent_a": agent_a,
        "agent_b": agent_b,
        "referee": {
            "model": "council-referee",
            "chosen_agent": chosen_agent,
            "scores": referee_scores,
            "critique": referee_critique,
            "raw_output": referee_critique,
        },
        "enhanced_answer": {
            "model": stage3_result.get("model", "chairman"),
            "answer": final_answer,
        },
    }

    return response_payload


@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Accept user feedback on a turn. For now we just acknowledge receipt.
    """
    return {
        "status": "received",
        "turn_id": request.turn_id,
        "label": request.label
    }

@app.post("/api/conversations/{conversation_id}/message/stream")
async def send_message_stream(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and start the 3-stage council process.
    Returns immediately with a 202 Accepted status.
    Client should then connect to the GET streaming endpoint.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Store this process in our ongoing processes dict
    process_queue = asyncio.Queue()
    ongoing_processes[conversation_id] = process_queue

    # Start the process in the background
    asyncio.create_task(run_council_process(conversation_id, request.content, process_queue))

    # Return immediately with 202 Accepted
    return {"status": "processing", "message": "Process started"}

async def run_council_process(conversation_id: str, content: str, process_queue: asyncio.Queue):
    """Run the council process and put events in the queue."""
    try:
        # Check if conversation exists
        conversation = storage.get_conversation(conversation_id)
        if conversation is None:
            await process_queue.put({"type": "error", "message": "Conversation not found"})
            return

        # Check if this is the first message
        is_first_message = len(conversation["messages"]) == 0

        # Add user message
        storage.add_user_message(conversation_id, content)

        # Start title generation in parallel (don't await yet)
        title_task = None
        if is_first_message:
            title_task = asyncio.create_task(generate_conversation_title(content))

        # Stage 1: Collect responses
        await process_queue.put({"type": "stage1_start"})
        stage1_results = await stage1_collect_responses(content)
        await process_queue.put({"type": "stage1_complete", "data": stage1_results})

        # Stage 2: Collect rankings
        await process_queue.put({"type": "stage2_start"})
        stage2_results, label_to_model = await stage2_collect_rankings(content, stage1_results)
        aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)
        await process_queue.put({
            "type": "stage2_complete", 
            "data": stage2_results, 
            "metadata": {
                "label_to_model": label_to_model, 
                "aggregate_rankings": aggregate_rankings
            }
        })

        # Stage 3: Synthesize final answer
        await process_queue.put({"type": "stage3_start"})
        stage3_result = await stage3_synthesize_final(content, stage1_results, stage2_results)
        await process_queue.put({"type": "stage3_complete", "data": stage3_result})

        # Wait for title generation if it was started
        if title_task:
            title = await title_task
            storage.update_conversation_title(conversation_id, title)
            await process_queue.put({"type": "title_complete", "data": {"title": title}})

        # Save complete assistant message
        storage.add_assistant_message(
            conversation_id,
            stage1_results,
            stage2_results,
            stage3_result
        )

        # Send completion event
        await process_queue.put({"type": "complete"})

    except Exception as e:
        # Send error event
        await process_queue.put({"type": "error", "message": str(e)})
    finally:
        # Clean up the process queue
        if conversation_id in ongoing_processes:
            del ongoing_processes[conversation_id]

@app.get("/api/conversations/{conversation_id}/stream")
async def stream_conversation_events(conversation_id: str):
    """
    Stream events for an ongoing conversation process.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if there's an ongoing process
    if conversation_id not in ongoing_processes:
        # No ongoing process, return empty stream
        async def empty_generator():
            yield f"data: {json.dumps({'type': 'info', 'message': 'No ongoing process'})}\n\n"
        return StreamingResponse(empty_generator(), media_type="text/event-stream")

    # Get the process queue
    process_queue = ongoing_processes[conversation_id]

    async def event_generator():
        try:
            while True:
                # Wait for an item from the queue
                item = await process_queue.get()
                yield f"data: {json.dumps(item)}\n\n"
                
                # If this is the completion or error event, stop streaming
                if item["type"] in ["complete", "error"]:
                    break
        except asyncio.CancelledError:
            # Client disconnected
            pass
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Streaming error: {str(e)}'})}\n\n"

    response = StreamingResponse(event_generator(), media_type="text/event-stream")
    
    # Add CORS headers manually since middleware doesn't always work with StreamingResponse
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Connection"] = "keep-alive"
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
