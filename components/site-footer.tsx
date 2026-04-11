export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center text-sm text-muted sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} Ehthasham Mustafa. All rights reserved.</p>
        <p>Built with Next.js, Tailwind CSS, and Framer Motion.</p>
      </div>
    </footer>
  );
}
