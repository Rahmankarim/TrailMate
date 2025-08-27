"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ActivityCardProps {
  id: string;
  title: string;
  tagline?: string;
  imageUrl?: string;
  difficulty?: string;
  durationHours?: number;
  onAction?: () => void;
}

export function ActivityCard({ id, title, tagline, imageUrl, difficulty, durationHours, onAction }: ActivityCardProps) {
  return (
    <Card
      data-id={id}
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all",
        "hover:shadow-xl hover:border-gray-300 hover:-translate-y-1"
      )}
    >
      <div className="relative h-44 w-full overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {difficulty && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-700 shadow-sm">
            {difficulty}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-base tracking-tight text-gray-900 line-clamp-1">{title}</h3>
        {tagline && <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{tagline}</p>}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          {durationHours && <span>{durationHours}h</span>}
          <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] font-medium text-primary" onClick={onAction}>View Activity</Button>
        </div>
      </div>
    </Card>
  );
}
