"use client";

import { motion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-y border-border bg-card/50 px-4 py-20 sm:px-6"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
        >
          <h2
            id="about-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            About
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Add a short bio: your background, what you care about, and the kind
            of collaborations you are open to. This section is easy to extend
            with a photo or timeline later.
          </p>
        </motion.div>
        <motion.ul
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
          className="grid gap-3 text-sm"
        >
          {["Frontend & product", "Design systems", "Performance & a11y"].map(
            (skill) => (
              <li
                key={skill}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {skill}
              </li>
            ),
          )}
        </motion.ul>
      </div>
    </section>
  );
}
