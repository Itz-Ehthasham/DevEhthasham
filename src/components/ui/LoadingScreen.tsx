'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function LoadingScreen() {
  const { loadingProgress, setLoading } = usePortfolioStore();
  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, { stiffness: 100, damping: 15 });

  useEffect(() => {
    progress.set(loadingProgress);
    if (loadingProgress >= 1) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, setLoading]);

  return (
    <div className="fixed inset-0 z-50 bg-[#03050a] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="font-mono text-xs tracking-widest uppercase text-[#3a4a5a] mb-8"
          animate={{ opacity: [0, 1, 1, 0], letterSpacing: ['0.5em', '0.5em', '1em', '2em'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          INITIALIZING SECTOR 7
        </motion.div>
        
        <div className="w-64 h-1 bg-[#0a0f1a] rounded-full overflow-hidden border border-[#1a2332] mx-auto mb-6">
          <motion.div
            style={{ width: springProgress }}
            className="h-full bg-gradient-to-r from-[#00d4aa] to-[#0088cc] rounded-full"
          />
        </div>
        
        <motion.p
          className="font-mono text-xs text-[#1a2332] font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {Math.round(loadingProgress * 100)}%
        </motion.p>
        
        <div className="mt-12 flex justify-center gap-4 text-xs text-[#0a0f1a] font-mono">
          <span>[■■■■■■■■■■] ASSETS</span>
          <span>[■■■■■■■■□□] SHADERS</span>
          <span>[■■■■■■□□□□] TERRAIN</span>
        </div>
      </div>
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6 text-xs text-[#0a0f1a] font-mono">
        <span>ESC: SKIP</span>
        <span>F1: PERF MODE</span>
        <span>F2: AUDIO</span>
      </div>
    </div>
  );
}