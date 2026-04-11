export type ArchiveProjectDetail = {
  overview: string;
  challenge: string;
  solution: string;
  results: string;
};

export type ArchiveProject = {
  slug: string;
  clientName: string;
  /** Shown inside the lime square */
  clientInitial: string;
  /** Large serif headline on the card */
  headline: string;
  tags: string[];
  videoSrc: string;
  role: string;
  year: string;
  detail: ArchiveProjectDetail;
};

export const archiveProjects: ArchiveProject[] = [
  {
    slug: "weekly-job-digest",
    clientName: "Handshake",
    clientInitial: "H",
    headline:
      "Redesigning the weekly job digest to increase student engagement by ~22%.",
    tags: ["Case Study", "A/B Testing", "Email Design"],
    videoSrc: "/videos/job-digest.mp4",
    role: "Full stack · Product engineering",
    year: "2024",
    detail: {
      overview:
        "Students were skimming the weekly digest; open rates were healthy but click-through to applications lagged behind targets.",
      challenge:
        "Clarify hierarchy of roles, reduce cognitive load, and surface personalized actions without breaking the existing email pipeline.",
      solution:
        "New modular layout, stronger typographic rhythm, A/B-tested subject lines and hero modules, plus instrumentation for funnel tracking.",
      results:
        "Engagement on primary CTA rose roughly 22%; time-to-first-click improved in both mobile and desktop clients.",
    },
  },
  {
    slug: "fintech-dashboard-os",
    clientName: "Northline",
    clientInitial: "N",
    headline:
      "A unified operations dashboard that replaced five internal tools and shortened weekly reporting.",
    tags: ["React", "Next.js", "Tailwind"],
    videoSrc: "/videos/fintech-dashboard.mp4",
    role: "Full stack development",
    year: "2024",
    detail: {
      overview:
        "Operations teams were juggling spreadsheets and legacy UIs to track balances, exceptions, and settlements.",
      challenge:
        "Ship a single source of truth with role-based views, fast tables, and exports without blocking day-to-day workflows.",
      solution:
        "Next.js app with shared design system, virtualized tables, optimistic updates, and background jobs for heavy aggregates.",
      results:
        "Reporting prep dropped from hours to minutes; fewer manual errors and a clearer audit trail for stakeholders.",
    },
  },
  {
    slug: "lumina-commerce",
    clientName: "Lumina",
    clientInitial: "L",
    headline:
      "A storefront refresh focused on conversion, accessibility, and a calmer editorial product story.",
    tags: ["Next.js", "Stripe", "UX"],
    videoSrc: "/videos/lumina.mp4",
    role: "Full stack · UI systems",
    year: "2023",
    detail: {
      overview:
        "The brand needed a calmer narrative and faster checkout while preserving flexibility for merchandising.",
      challenge:
        "Balance rich imagery with performance budgets; tighten a11y and mobile tap targets across the funnel.",
      solution:
        "Componentized PDP and collection templates, Stripe payment flows with clear error recovery, image pipeline tuned for LCP.",
      results:
        "Higher checkout completion on mobile; improved Lighthouse scores and fewer support tickets on payment edge cases.",
    },
  },
  {
    slug: "datametrics-saas",
    clientName: "DataMetrics",
    clientInitial: "D",
    headline:
      "Marketing site and onboarding flows that explain a dense analytics product in plain language.",
    tags: ["TypeScript", "Framer Motion", "Content"],
    videoSrc: "/videos/datametrics.mp4",
    role: "Frontend · Motion",
    year: "2023",
    detail: {
      overview:
        "Prospects bounced on technical jargon before reaching a demo; the story needed to be simpler and more visual.",
      challenge:
        "Explain pipelines and dashboards without overwhelming first-time visitors or SEO crawlers.",
      solution:
        "Narrative landing sections with motion for pacing, interactive diagrams, and a guided demo request path.",
      results:
        "Longer time on page and more qualified demo requests; clearer differentiation from generic BI landing pages.",
    },
  },
];

export function getArchiveProject(slug: string): ArchiveProject | undefined {
  return archiveProjects.find((p) => p.slug === slug);
}

export function getArchiveSlugs(): string[] {
  return archiveProjects.map((p) => p.slug);
}
