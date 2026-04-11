"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { easeOutExpo } from "@/lib/motion";

type ArchiveDetailVideoProps = {
  videoSrc: string;
  title: string;
};

export function ArchiveDetailVideo({
  videoSrc,
  title,
}: ArchiveDetailVideoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden bg-[#0a0a0a]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(159,232,112,0.12)_0%,transparent_55%)]"
        aria-hidden
      />
      {videoSrc && !failed ? (
        <video
          className="relative z-0 aspect-video w-full object-cover"
          controls
          playsInline
          preload="metadata"
          title={title}
          onError={() => setFailed(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] px-6 text-center text-sm text-white/45">
          Video not found. Add{" "}
          <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">
            {videoSrc}
          </code>{" "}
          under public.
        </div>
      )}
    </motion.div>
  );
}
