"use client";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface DestinationCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  priceFrom?: number;
  priceTo?: number;
  highlight?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function DestinationCard({
  id,
  title,
  description,
  imageUrl,
  location,
  rating,
  reviews,
  priceFrom,
  priceTo,
  highlight,
  onAction,
  actionLabel = "View Details",
}: DestinationCardProps) {
  const topRated = (rating || 0) >= 4.7;
  return (
    <Card
      data-id={id}
      className={cn(
        "group relative bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/70 shadow-sm flex flex-col overflow-hidden transition-all",
        "hover:shadow-2xl hover:border-gray-300 hover:-translate-y-1 hover:scale-[1.01]",
        highlight && "ring-2 ring-teal-400/40"
      )}
    >
      <div className="relative w-full h-56 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-xs">No Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {location && (
            <span className="px-2 py-0.5 rounded-full bg-white/85 backdrop-blur text-[10px] font-medium text-gray-700 shadow-sm">
              {location}
            </span>
          )}
          {topRated && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Top Rated
            </span>
          )}
          {highlight && !topRated && (
            <span className="px-2 py-0.5 rounded-full bg-teal-500/90 text-[10px] font-semibold text-white shadow-sm flex items-center gap-1">
              Highlight
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <h3 className="font-semibold text-lg tracking-tight text-gray-900 leading-snug line-clamp-1 group-hover:text-gray-700">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>
        )}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-600 font-medium">
              {typeof rating === "number" ? (
                <>
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="text-amber-500/50">({reviews || 0})</span>
                </>
              ) : (
                <span className="text-gray-400">No ratings</span>
              )}
            </div>
            {typeof priceFrom === "number" && (
              <span className="font-medium text-gray-700">
                ${priceFrom}
                {priceTo && priceTo !== priceFrom ? ` - $${priceTo}` : ""}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-[11px] font-medium text-primary hover:text-primary/90 group/button"
            onClick={onAction}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
