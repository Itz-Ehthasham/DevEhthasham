'use client';

import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function HeroOverlay() {
  const { currentSection, scrollProgress } = usePortfolioStore();
  const heroProgress = Math.min(scrollProgress, 1);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none flex items-start justify-center pt-20 px-4"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{
            opacity: heroProgress,
            y: 0,
            filter: 'blur(0px)',
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            opacity: heroProgress,
            transform: `translateY(${heroProgress * -100}px)`,
            filter: `blur(${heroProgress * 20}px)`,
          }}
        >
          <motion.span
            className="inline-block font-mono text-xs tracking-[0.5em] uppercase text-[#00d4aa] mb-6"
            style={{
              opacity: heroProgress,
              transform: `translateY(${heroProgress * -20}px)`,
            }}
          >
            EHTHASHAM MUSTAFA
          </motion.span>

          <motion.h1
            className="text-5xl sm:text-7xl md:text-9xl font-light tracking-tight text-white leading-[0.95] mb-8"
            style={{
              opacity: heroProgress,
              transform: `translateY(${heroProgress * -30}px)`,
            }}
          >
            FULL STACK<span className="font-bold"> ENGINEER</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#3a4a5a] max-w-2xl mx-auto mb-12 font-light leading-relaxed"
            style={{
              opacity: heroProgress,
              transform: `translateY(${heroProgress * -20}px)`,
            }}
          >
            Building scalable, high-performance web applications.
            <span className="text-[#00d4aa] font-medium"> React • Three.js • Systems</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              opacity: heroProgress,
              transform: `translateY(${heroProgress * -20}px)`,
            }}
          >
            <motion.a
              href="#work"
              className="group relative px-8 py-4 bg-[#00d4aa] text-[#03050a] font-mono text-sm uppercase tracking-wider rounded-none overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">VIEW PROJECTS</span>
              <motion.div
                className="absolute inset-0 bg-white translate-x-[-100%]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                animate={{ x: ['-100%', '100%'] }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="group relative px-8 py-4 border-2 border-[#1a2332] text-[#3a4a5a] font-mono text-sm uppercase tracking-wider rounded-none overflow-hidden"
              whileHover={{ borderColor: '#00d4aa', color: '#00d4aa' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">CONTACT</span>
              <motion.div
                className="absolute inset-0 bg-[#00d4aa] translate-x-[-100%]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                animate={{ x: ['-100%', '100%'] }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <motion.span className="font-mono text-xs text-[#1a2332] tracking-wider">SCROLL TO EXPLORE</motion.span>
        <motion.div
          className="w-1 h-12 bg-gradient-to-b from-[#1a2332] to-transparent rounded-full"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <NavigationHUD />
    </>
  );
}

function NavigationHUD() {
  const { currentSection } = usePortfolioStore();
  const sections = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
  const labels = ['HOME', 'ABOUT', 'SKILLS', 'PROJECTS', 'CONTACT'];

  return (
    <nav className="fixed top-6 left-6 z-20 flex flex-col gap-3 pointer-events-auto">
      {sections.map((section, i) => (
        <motion.button
          key={section}
          className="group relative flex items-center gap-3 px-3 py-2 bg-[#03050a]/80 border border-[#1a2332] rounded-r-lg backdrop-blur-sm"
          whileHover={{ x: 8 }}
          onClick={() => window.location.href = `#${section === 'hero' ? '' : section}`}
          style={{ opacity: currentSection === section ? 1 : 0.4 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-[#1a2332]"
            animate={{ backgroundColor: currentSection === section ? '#00d4aa' : '#1a2332', scale: currentSection === section ? 1.5 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="font-mono text-xs tracking-wider text-[#3a4a5a] group-hover:text-white">
            {labels[i]}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}