import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveDetailVideo } from "@/components/archive-detail-video";
import {
  getArchiveProject,
  getArchiveSlugs,
} from "@/lib/archive-projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArchiveSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getArchiveProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.clientName,
    description: project.headline,
  };
}

export default async function ArchiveProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getArchiveProject(slug);
  if (!project) notFound();

  const { detail } = project;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/archive"
        className="text-sm font-medium text-[#444] underline-offset-4 hover:text-[#111] hover:underline"
      >
        ← All projects
      </Link>

      <header className="mt-8 border-b border-black/[0.08] pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#666]">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-[#0d0d0d]"
            style={{ backgroundColor: "#9fe870" }}
          >
            {project.clientInitial}
          </span>
          <span className="font-medium text-[#333]">{project.clientName}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{project.role}</span>
        </div>
        <h1 className="font-serif mt-6 text-2xl font-normal leading-snug tracking-tight text-[#111] sm:text-3xl md:text-[2rem] md:leading-[1.3]">
          {project.headline}
        </h1>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-black/[0.1] bg-white px-3 py-1 text-xs font-medium text-[#444]"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <ArchiveDetailVideo
          videoSrc={project.videoSrc}
          title={`${project.clientName} preview`}
        />
      </div>

      <div className="mt-12 max-w-none">
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666]">
            Overview
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#333]">
            {detail.overview}
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666]">
            Challenge
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#333]">
            {detail.challenge}
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666]">
            Solution
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#333]">
            {detail.solution}
          </p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666]">
            Results
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#333]">
            {detail.results}
          </p>
        </section>
      </div>
    </main>
  );
}
