import Link from "next/link";

export default function ArchiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#eeeee9] text-[#1a1a1a]">
      <header className="sticky top-0 z-[10000] border-b border-black/[0.06] bg-[#eeeee9]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#333] transition-colors hover:text-[#111]"
          >
            ← Home
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#666]">
            Archive
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
