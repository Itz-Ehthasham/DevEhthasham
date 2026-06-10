import { CanvasProvider } from '@/components/providers/CanvasProvider';
import { HeroOverlay } from '@/components/ui/HeroOverlay';

export default function Home() {
  return (
    <>
      <CanvasProvider />
      <HeroOverlay />
      <main className="relative z-20 min-h-screen">
        <section id="about" className="min-h-screen" />
        <section id="skills" className="min-h-screen" />
        <section id="projects" className="min-h-screen" />
        <section id="contact" className="min-h-screen" />
      </main>
    </>
  );
}