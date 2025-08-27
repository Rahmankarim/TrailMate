"use client";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
  id: string;
  userName: string;
  avatarUrl?: string;
  rating: number;
  review: string;
  date?: string;
}

export function ReviewCard({ id, userName, avatarUrl, rating, review, date }: ReviewCardProps) {
  return (
    <Card
      data-id={id}
      className={cn("bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 flex flex-col gap-4 transition hover:shadow-lg")}
    >
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
            {userName.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-gray-900">{userName}</span>
          {date && <span className="text-[11px] text-gray-500">{date}</span>}
        </div>
        <div className="ml-auto flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-4 h-4", i < Math.round(rating) ? "fill-amber-500" : "fill-gray-200 text-gray-300")}/>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">{review}</p>
    </Card>
  );
}
