"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { easeOutExpo } from "@/lib/motion";

type ProjectVideoCardProps = {
  title: string;
  tags: string[];
  videoSrc: string;
  className?: string;
  index?: number;
};

export function ProjectVideoCard({
  title,
  tags,
  videoSrc,
  className = "",
  index = 0,
}: ProjectVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  const play = useCallback(() => {
    if (reduceMotion || videoFailed || !videoSrc) return;
    void videoRef.current?.play().catch(() => setVideoFailed(true));
  }, [reduceMotion, videoFailed, videoSrc]);

  const pause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  return (
    <motion.article
      className={`relative isolate min-h-[220px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[2px] md:min-h-[280px] ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        ease: easeOutExpo,
        delay: index * 0.06,
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.012, y: -2 }}
      onMouseEnter={play}
      onMouseLeave={pause}
    >
      {videoSrc && !videoFailed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden
          onError={() => setVideoFailed(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#2a4a3c] via-[#1e2e28] to-[#152018]"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
        aria-hidden
      />
      <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur-md sm:text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="absolute bottom-3 left-3 right-3 text-base font-semibold leading-snug tracking-tight text-white sm:bottom-4 sm:left-4 sm:right-4 sm:text-lg md:text-xl">
        {title}
      </h3>
    </motion.article>
  );
}
