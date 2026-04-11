export type ProjectLayout = "wide" | "narrow";

export type ProjectEntry = {
  title: string;
  tags: string[];
  /** Place MP4 files in `public/videos/` (e.g. `/videos/my-project.mp4`). */
  videoSrc: string;
  layout: ProjectLayout;
};

export const featuredProjects: ProjectEntry[] = [
  {
    title: "Fintech Dashboard OS",
    tags: ["React", "Next.js", "Tailwind"],
    videoSrc: "/videos/fintech-dashboard.mp4",
    layout: "wide",
  },
  {
    title: "Lumina E-Commerce",
    tags: ["Next.js", "Stripe"],
    videoSrc: "/videos/lumina.mp4",
    layout: "narrow",
  },
  {
    title: "DataMetrics SaaS",
    tags: ["TypeScript", "Framer Motion"],
    videoSrc: "/videos/datametrics.mp4",
    layout: "narrow",
  },
  {
    title: "Aura Wallet",
    tags: ["React Native", "Web3"],
    videoSrc: "/videos/aura-wallet.mp4",
    layout: "wide",
  },
];
