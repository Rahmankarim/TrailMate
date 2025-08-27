"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface HighlightCardProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  text?: string;
  accent?: "teal" | "blue" | "amber" | "stone";
}

const accentMap: Record<string, string> = {
  teal: "from-teal-500/15 to-teal-500/5 text-teal-700 border-teal-500/30",
  blue: "from-blue-500/15 to-blue-500/5 text-blue-700 border-blue-500/30",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-700 border-amber-500/30",
  stone: "from-stone-500/15 to-stone-500/5 text-stone-700 border-stone-500/30",
};

export function HighlightCard({ id, icon, title, text, accent = "teal" }: HighlightCardProps) {
  return (
    <Card
      data-id={id}
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition",
        accentMap[accent]
      )}
    >
      {icon && <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-inherit shadow-sm">{icon}</div>}
      <h3 className="font-semibold text-base leading-snug">{title}</h3>
      {text && <p className="text-sm text-gray-600 leading-relaxed">{text}</p>}
    </Card>
  );
}
