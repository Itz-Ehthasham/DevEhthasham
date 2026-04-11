"use client";

import { motion } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 px-4 py-20 sm:px-6"
      aria-labelledby="contact-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
        className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 sm:p-10"
      >
        <h2
          id="contact-heading"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Contact
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Open to freelance, full-time, or just a coffee chat — update this
          block with your email and social links.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:hello@example.com"
            className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
          >
            hello@example.com
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}
