import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Layers, Scale, Sparkles, History, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Compare Local Agents Side by Side',
    description: 'Agent A (phi3:mini) and Agent B (qwen2:7b) answer your questions in parallel. See both perspectives instantly.',
    highlights: ['Parallel processing', 'Local models', 'Privacy-first'],
  },
  {
    icon: Scale,
    title: 'Referee Model for Judgement',
    description: 'The Referee (deepseek-r1) evaluates both answers, scores them on correctness, clarity, and usefulness, then picks the winner.',
    highlights: ['Objective scoring', 'Detailed critique', 'Smart selection'],
  },
  {
    icon: Sparkles,
    title: 'Enhancer Agent for Polished Output',
    description: 'The winning answer gets refined and enhanced for maximum clarity and detail. Get the best possible response.',
    highlights: ['Answer refinement', 'Improved clarity', 'Enhanced detail'],
  },
  {
    icon: History,
    title: 'History & Feedback Loop',
    description: 'Track all your past queries, see referee decisions, and provide feedback to improve future responses.',
    highlights: ['Full history', 'Human feedback', 'Analytics'],
  },
];

const FeatureMockPanel = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-full"
    >
      {/* Mock Browser/App Window */}
      <div className="relative bg-gradient-to-br from-card/40 via-card/30 to-background/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Window Header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="text-xs text-card-foreground/60 px-3 py-1 bg-background/40 rounded-md">
              AI Agent Panel
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Feature Icon Display */}
          <motion.div
            initial={{ scale: 0.8, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-foreground/5 border border-foreground/10"
          >
            <feature.icon className="h-10 w-10 text-card-foreground" />
          </motion.div>

          {/* Mock Data Visualization */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-3"
              >
                <motion.div 
                className="w-2 h-2 rounded-full bg-foreground"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="flex-1 h-2 bg-foreground/10 rounded-full" 
                     style={{ width: `${100 - i * 15}%` }} />
                <div className="text-xs text-card-foreground/40">
                  {100 - i * 15}%
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mock Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-square bg-gradient-to-br from-background/60 to-background/30 rounded-lg border border-white/5 p-3 cursor-pointer"
              >
                <div className="w-full h-2 bg-foreground/10 rounded-full mb-2" />
                <div className="w-3/4 h-2 bg-foreground/5 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-foreground/2 rounded-2xl pointer-events-none" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-24 h-24 bg-foreground/5 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-4 w-32 h-32 bg-foreground/5 rounded-full blur-2xl"
      />
    </motion.div>
  );
};

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef(null);
  const cardRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isCardInView = useInView(cardRef, { once: true, margin: "-100px" });

  const activeFeature = features[activeIndex];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  return (
    <section 
      id="features" 
      className="relative py-24 sm:py-32 overflow-hidden bg-section-alt"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-foreground/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
          >
            One Question. Four Agents.{' '}
            <span className="text-gradient">Optimal Answer.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Every feature is designed to amplify your AI-powered productivity and deliver the most accurate responses.
          </motion.p>
        </motion.div>

        {/* Main Feature Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isCardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ y: -10, scale: 1.01 }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-30" />

          {/* Glass Card */}
          <div className="relative bg-gradient-to-br from-card/60 via-card/40 to-background/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {/* Icon Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-foreground text-background shadow-lg mb-6"
                    >
                      <activeFeature.icon className="h-7 w-7" />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                      className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                    >
                      {activeFeature.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                      className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6"
                    >
                      {activeFeature.description}
                    </motion.p>

                    {/* Highlights */}
                    <div className="space-y-3">
                      {activeFeature.highlights.map((highlight, idx) => (
                        <motion.div
                          key={highlight}
                          initial={{ opacity: 0, x: -25 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1, duration: 0.5, ease: "easeOut" }}
                          className="flex items-center gap-3"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 300 }}
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-foreground" />
                          </motion.div>
                          <span className="text-foreground/90">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column - Mock UI */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <AnimatePresence mode="wait">
                    <FeatureMockPanel 
                      key={activeIndex} 
                      feature={activeFeature} 
                      index={activeIndex} 
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-center gap-6 mt-12"
        >
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-foreground/10 hover:border-foreground/40 hover:bg-card/80 transition-all shadow-lg"
            aria-label="Previous feature"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveIndex(index)}
                className="relative"
                aria-label={`Go to ${feature.title}`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: index === activeIndex ? 48 : 10,
                    opacity: index === activeIndex ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`h-2.5 rounded-full ${
                    index === activeIndex 
                      ? 'bg-foreground shadow-lg' 
                      : 'bg-foreground/20 hover:bg-foreground/40'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-foreground/10 hover:border-foreground/40 hover:bg-card/80 transition-all shadow-lg"
            aria-label="Next feature"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Feature Labels (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isCardInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          {features.map((feature, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.4 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === activeIndex
                  ? 'bg-foreground text-background shadow-lg'
                  : 'bg-card/40 backdrop-blur-sm border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              {feature.title.split(' ').slice(0, 2).join(' ')}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}