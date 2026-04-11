"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { easeOutExpo } from "@/lib/motion";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[10000] px-4 pt-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
        className="pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-glass-stroke bg-glass-fill px-4 shadow-[0_8px_32px_var(--glass-shadow),inset_0_1px_0_0_var(--glass-inner-highlight)] backdrop-blur-xl backdrop-saturate-150 sm:px-6"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Portfolio
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/35 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
