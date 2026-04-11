"use client";

import { motion } from "framer-motion";
import { BmwHoverReveal } from "@/components/bmw-hover-reveal";
import { easeOutExpo } from "@/lib/motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

export function Hero() {
  return (
    <section
      className="relative px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl lg:max-w-none"
        >
          <motion.h1
            id="hero-heading"
            variants={item}
            className="font-serif text-[1.65rem] font-normal leading-[1.35] tracking-tight text-foreground sm:text-3xl sm:leading-[1.32] md:text-[2.35rem] md:leading-[1.28]"
          >
            Hey, I&apos;m{" "}
            <strong className="font-semibold">Ehthasham Mustafa</strong>, a full
            stack developer who loves to bring life to your projects.
          </motion.h1>
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium"
          >
            <a
              href="#work"
              className="border-b border-foreground/25 pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              View work
            </a>
            <a
              href="#contact"
              className="border-b border-foreground/25 pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easeOutExpo, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[400px]"
        >
          <BmwHoverReveal />
        </motion.div>
      </div>
    </section>
  );
}
