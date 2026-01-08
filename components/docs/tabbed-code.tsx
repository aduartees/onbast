"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

interface TabCode {
  tab: string;
  code: string;
  language?: string;
}

interface TabbedCodeProps {
  codes: TabCode[];
  filename?: string;
  className?: string;
}

export function TabbedCode({ codes, filename, className = "" }: TabbedCodeProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeCode = codes[activeTab];

  return (
    <div className={className}>
      <div className="flex border-b border-slate-800 overflow-x-auto">
        {codes.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              index === activeTab
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>
      <CodeBlock
        code={activeCode.code}
        language={activeCode.language || "bash"}
        filename={filename}
        className="rounded-t-none"
      />
    </div>
  );
}
