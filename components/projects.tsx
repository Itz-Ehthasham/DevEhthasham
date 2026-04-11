"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectVideoCard } from "@/components/project-video-card";
import { featuredProjects } from "@/lib/projects-data";
import { easeOutExpo } from "@/lib/motion";

function ArchiveArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 opacity-80"
      aria-hidden
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Projects() {
  return (
    <section
      id="work"
      className="scroll-mt-24 border-t border-border bg-background px-4 py-20 text-foreground sm:px-6 sm:py-28"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="max-w-2xl"
          >
            <h2
              id="work-heading"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Selected work
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              A collection of recent projects focusing on performance,
              interaction, and scalable architecture.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: easeOutExpo, delay: 0.05 }}
            className="shrink-0 sm:pt-1"
          >
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              View all archive
              <ArchiveArrow />
            </Link>
          </motion.div>
        </div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
          {featuredProjects.map((project, i) => {
            const colClass =
              project.layout === "wide" ? "md:col-span-3" : "md:col-span-1";
            return (
              <li key={project.title} className={colClass}>
                <ProjectVideoCard
                  title={project.title}
                  tags={project.tags}
                  videoSrc={project.videoSrc}
                  index={i}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
