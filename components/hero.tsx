"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { BmwHoverReveal } from "@/components/bmw-hover-reveal";
import VariableProximity from "@/components/VariableProximity";
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

const PROXIMITY_HEADLINE =
  "Full Stack Engineer building scalable, high-performance web applications.";

export function Hero() {
  const proximityContainerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
          <motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-sm"
          >
            Ehthasham Mustafa
          </motion.p>

          <motion.div variants={item} className="mt-4">
            <div
              ref={proximityContainerRef}
              className="relative w-full max-w-3xl"
              style={{ position: "relative" }}
            >
              <h1
                id="hero-heading"
                className="m-0 text-[1.65rem] font-normal leading-[1.15] tracking-tight text-foreground sm:text-3xl sm:leading-[1.12] md:text-4xl md:leading-[1.1] lg:text-[2.75rem]"
              >
                <VariableProximity
                  label={PROXIMITY_HEADLINE}
                  className="block w-full leading-[1.15] tracking-tight text-foreground"
                  fromFontVariationSettings="'wght' 400, 'opsz' 8"
                  toFontVariationSettings="'wght' 1000, 'opsz' 40"
                  containerRef={proximityContainerRef}
                  radius={100}
                  falloff="linear"
                />
              </h1>
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Frontend:{" "}
            <span className="text-foreground/90">
              React, component-driven UIs, and polished product interfaces.
            </span>{" "}
            Backend:{" "}
            <span className="text-foreground/90">
              REST and GraphQL APIs, databases, and pragmatic system design.
            </span>{" "}
            I optimize for{" "}
            <span className="font-medium text-foreground">
              performance, reliability, and clean, maintainable code
            </span>{" "}
            from first render to production traffic.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 25 }}
              className="inline-flex"
            >
              <Link
                href="/#work"
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-accent-hover hover:text-primary-foreground sm:text-base"
              >
                View Projects
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 25 }}
              className="inline-flex"
            >
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-border bg-card px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent sm:text-base"
              >
                Contact
              </Link>
            </motion.div>
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
