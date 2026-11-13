import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, reviewsCount = null, size = 16, showNumber = true }) {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-1.5 text-amber-500">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700">
          {rounded}
        </span>
      )}
      {reviewsCount !== null && (
        <span className="text-xs text-slate-400">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}

