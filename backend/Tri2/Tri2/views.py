# ... existing code ...

from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chat_view(request):
    """
    Accepts POST {"prompt": "..."} and returns {"reply": "..."}.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST is supported.')

    try:
        data = json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return HttpResponseBadRequest('Invalid JSON payload.')

    prompt = data.get('prompt', '').strip()
    if not prompt:
        return HttpResponseBadRequest('Field "prompt" is required.')

    # Simple echo reply (replace with your actual AI logic)
    reply = f"Echo: {prompt}"

    return JsonResponse({'reply': reply})

from django.conf.urls import url

urlpatterns = [
    url(r'api/chat', chat_view, name='chat_view')
]


from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chat_view(request):
    """
    Accepts POST {"prompt": "..."} and returns {"reply": "..."}.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest('Only POST is supported.')

    try:
        data = json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return HttpResponseBadRequest('Invalid JSON payload.')

    prompt = data.get('prompt', '').strip()
    if not prompt:
        return HttpResponseBadRequest('Field "prompt" is required.')

    # Simple echo reply (replace with your actual AI logic)
    reply = f"Echo: {prompt}"

    return JsonResponse({'reply': reply})

from django.conf.urls import url

urlpatterns = [
    url(r'api/chat', chat_view, name='chat_view')
]