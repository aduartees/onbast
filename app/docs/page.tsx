import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation - ONBAST",
  description: "ONBAST documentation guides and resources",
};

export default function DocsIndex() {
  const guides = [
    {
      title: "Getting started with Speed Insights",
      description: "Learn how to enable Vercel Speed Insights on your project and monitor performance metrics.",
      href: "/docs/speed-insights",
      category: "Performance",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Documentation</h1>
          <p className="text-lg text-slate-400">
            Explore our guides and documentation to help you get started with various features and tools.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid gap-6">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.href}>
              <div className="group relative p-6 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer hover:bg-slate-900/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-slate-800 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                      {guide.category}
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-slate-400">{guide.description}</p>
                  </div>
                  <div className="ml-4 text-slate-600 group-hover:text-cyan-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
