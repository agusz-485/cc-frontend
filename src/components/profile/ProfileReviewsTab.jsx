import { P, REVIEWS, StarRating } from "../../shared";

export function ProfileReviewsTab({ reviews = REVIEWS }) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map(({ author, rating, date, text }) => (
        <div
          key={author}
          className="p-4 rounded-xl"
          style={{ border: `1px solid ${P.baseNeutral}` }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: P.secondary }}
              >
                {author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: P.dark }}>
                  {author}
                </p>
                <p className="text-xs" style={{ color: P.neutralDark }}>
                  {date}
                </p>
              </div>
            </div>
            <StarRating rating={rating} size="sm" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: P.dark }}>
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}
