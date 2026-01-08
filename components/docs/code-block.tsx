"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "bash", filename, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-lg bg-slate-950 border border-slate-800 overflow-hidden ${className}`}>
      {filename && (
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-sm text-slate-400 font-mono">
          {filename}
        </div>
      )}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400" />}
      </button>
      <pre className={`p-4 overflow-x-auto text-sm ${filename ? "" : "pt-6"}`}>
        <code className={`text-slate-200 font-mono language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
