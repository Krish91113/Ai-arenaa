import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is a multi-agent AI system?',
    answer: 'A multi-agent AI system uses multiple AI models working together to solve a problem. In our case, two agent models (phi3:mini and qwen2:7b) independently answer your question, then a referee model (deepseek-r1) evaluates both responses and selects the best one. Finally, an enhancer model polishes the winning answer for optimal clarity and detail.',
  },
  {
    question: 'Do all models run locally via Ollama?',
    answer: 'Yes! All AI models run entirely on your local machine using Ollama. This means your data never leaves your computer, ensuring complete privacy and security. You\'ll need to have Ollama installed and the required models downloaded before using the system.',
  },
  {
    question: 'What is the Referee model doing?',
    answer: 'The Referee model (deepseek-r1) acts as an impartial judge. It evaluates both agent responses based on three criteria: correctness (factual accuracy), clarity (how well the answer is communicated), and usefulness (practical value of the response). It then provides scores, a critique, and selects the better answer.',
  },
  {
    question: 'Can I change which models are used?',
    answer: 'The current system uses phi3:mini and qwen2:7b as agents, with deepseek-r1 as the referee. While the frontend displays these specific models, the backend can be configured to use different Ollama-compatible models based on your needs and hardware capabilities.',
  },
  {
    question: 'What happens if the backend is not running?',
    answer: 'If the backend API isn\'t running, you\'ll see a friendly error message in the Playground. The UI will remain fully functional and ready to use—just start the backend server at localhost:8000 and try again.',
  },
  {
    question: 'How is the final answer enhanced?',
    answer: 'After the referee selects the winning response, an enhancement step refines the answer. This process improves clarity, adds relevant details, and ensures the response is well-structured and easy to understand while preserving the core content of the original answer.',
  },
];

export function FAQ() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="faqs" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the Multi-Agent Arena system.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline py-5 text-foreground hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}