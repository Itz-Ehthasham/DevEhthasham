import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function useScrollProgress() {
  const { setScrollProgress, setSection } = usePortfolioStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1);
      
      setScrollProgress(progress * 5);

      if (progress < 0.15) setSection('hero');
      else if (progress < 0.35) setSection('about');
      else if (progress < 0.55) setSection('skills');
      else if (progress < 0.75) setSection('projects');
      else setSection('contact');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress, setSection]);
}