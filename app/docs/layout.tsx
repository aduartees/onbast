import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - ONBAST",
  description: "ONBAST documentation and guides",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navigation bar for docs - minimal, no Sanity queries */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-neutral-950/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/" className="text-slate-400 hover:text-slate-300 transition-colors">
            ← Back to Home
          </a>
          <span className="text-slate-600">Docs</span>
        </div>
      </nav>

      {/* Main content */}
      <div>{children}</div>
    </>
  );
}
