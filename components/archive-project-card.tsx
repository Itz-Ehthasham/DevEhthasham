"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { ArchiveProject } from "@/lib/archive-projects";
import { easeOutExpo } from "@/lib/motion";

const LIME = "#9fe870";
const LIME_SOFT = "rgba(159, 232, 112, 0.38)";

type ArchiveProjectCardProps = {
  project: ArchiveProject;
  index: number;
};

export function ArchiveProjectCard({ project, index }: ArchiveProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  const play = useCallback(() => {
    if (reduceMotion || videoFailed) return;
    void videoRef.current?.play().catch(() => setVideoFailed(true));
  }, [reduceMotion, videoFailed]);

  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: easeOutExpo, delay: index * 0.08 }}
    >
      <Link
        href={`/archive/${project.slug}`}
        className="group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] outline-none ring-black/[0.04] transition-[box-shadow,transform] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[var(--archive-lime)]"
        style={
          {
            "--archive-lime": LIME,
          } as React.CSSProperties
        }
      >
        <article className="grid md:grid-cols-[1fr_1.05fr]">
          <div
            className="flex flex-col justify-between gap-8 p-6 sm:p-8 md:min-h-[280px]"
            onMouseEnter={play}
            onMouseLeave={pause}
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-[#0d0d0d]"
                  style={{ backgroundColor: LIME }}
                  aria-hidden
                >
                  {project.clientInitial}
                </span>
                <span className="text-sm font-semibold tracking-tight text-[#1a1a1a]">
                  {project.clientName}
                </span>
              </div>
              <h2 className="font-serif mt-8 text-xl font-normal leading-snug tracking-tight text-[#1a1a1a] sm:text-2xl md:mt-10 md:text-[1.65rem] md:leading-[1.35]">
                {project.headline}
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-black/[0.1] bg-white px-3 py-1 text-xs font-medium text-[#444]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative flex min-h-[220px] items-center justify-center overflow-hidden md:min-h-[300px]"
            style={{
              background: `radial-gradient(ellipse 85% 75% at 55% 45%, ${LIME_SOFT} 0%, rgba(255,255,255,0.4) 45%, #fafafa 100%)`,
            }}
            onMouseEnter={play}
            onMouseLeave={pause}
          >
            <div
              className="relative z-[1] w-[55%] max-w-[220px] overflow-hidden rounded-[1.85rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_24px_48px_rgba(0,0,0,0.18)] sm:w-[48%] sm:max-w-none sm:rounded-[2rem] sm:border-[6px]"
              style={{ aspectRatio: "9 / 18.5" }}
            >
              {project.videoSrc && !videoFailed ? (
                <video
                  ref={videoRef}
                  className="pointer-events-none h-full w-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  aria-hidden
                  onError={() => setVideoFailed(true)}
                >
                  <source src={project.videoSrc} type="video/mp4" />
                </video>
              ) : (
                <div
                  className="flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-b from-[#2a2a2a] to-[#111]"
                  aria-hidden
                >
                  <span className="px-4 text-center text-xs text-white/50">
                    Add video: {project.videoSrc}
                  </span>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
