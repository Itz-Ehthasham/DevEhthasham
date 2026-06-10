'use client';

import { Environment } from './Environment';
import { Character } from './Character';
import { SkillNodes } from './SkillNodes';
import { ProjectOrbs } from './ProjectOrbs';
import { Particles } from './Particles';
import { SunLight } from './SunLight';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function Scene() {
  const { currentSection, performanceMode } = usePortfolioStore();
  
  return (
    <>
      <SunLight />
      <Environment />
      <Character />
      {currentSection !== 'hero' && <SkillNodes />}
      {['skills', 'projects'].includes(currentSection) && <ProjectOrbs />}
      {['hero', 'about'].includes(currentSection) && <Particles type="dust" />}
      {currentSection === 'projects' && <Particles type="warp" />}
    </>
  );
}