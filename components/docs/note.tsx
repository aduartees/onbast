import { AlertCircle, Lightbulb } from "lucide-react";

interface NoteProps {
  type?: "info" | "note" | "warning";
  children: React.ReactNode;
}

export function Note({ type = "note", children }: NoteProps) {
  const baseStyles = "rounded-lg border-l-4 p-4 flex gap-3";
  
  const styles: Record<string, { bg: string; border: string; icon: typeof AlertCircle }> = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-500 dark:border-blue-500",
      icon: AlertCircle,
    },
    note: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-500 dark:border-amber-500",
      icon: Lightbulb,
    },
    warning: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-500 dark:border-red-500",
      icon: AlertCircle,
    },
  };

  const config = styles[type];
  const Icon = config.icon;

  return (
    <div className={`${baseStyles} ${config.bg} ${config.border}`}>
      <Icon className="flex-shrink-0 w-5 h-5 mt-0.5 text-inherit" />
      <div className="text-sm text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
}
