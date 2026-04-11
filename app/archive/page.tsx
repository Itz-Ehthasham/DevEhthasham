import type { Metadata } from "next";
import { ArchiveProjectCard } from "@/components/archive-project-card";
import { archiveProjects } from "@/lib/archive-projects";

export const metadata: Metadata = {
  title: "Project archive",
  description:
    "Case studies and project videos — full stack work by Ehthasham Mustafa.",
};

export default function ArchivePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 sm:mb-14">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111] sm:text-4xl">
          Project archive
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#555] sm:text-base">
          Click a project for the full case study and video. Cards preview footage
          on hover.
        </p>
      </div>

      <ul className="flex list-none flex-col gap-8 sm:gap-10">
        {archiveProjects.map((project, i) => (
          <li key={project.slug}>
            <ArchiveProjectCard project={project} index={i} />
          </li>
        ))}
      </ul>
    </main>
  );
}
