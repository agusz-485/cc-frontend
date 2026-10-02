import { P } from "../../shared";

export function DirectorySkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-4 bg-slate-200 rounded-lg w-44" />
        <div className="h-4 bg-slate-200 rounded-lg w-28 hidden sm:block" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-5 border shadow-xs flex flex-col justify-between"
            style={{ borderColor: P.baseNeutral }}
          >
            <div>
              {/* Card top: Avatar + Badges */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-slate-200 rounded-lg w-28" />
                    <div className="h-4 bg-slate-200 rounded-full w-12" />
                  </div>
                  <div className="h-3 bg-slate-200 rounded-lg w-36" />
                  <div className="h-3 bg-slate-200 rounded-lg w-24" />
                </div>
              </div>

              {/* Bio summary lines */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-100 rounded-md w-full" />
                <div className="h-3 bg-slate-100 rounded-md w-4/5" />
              </div>

              {/* Tags shimmer */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <div className="h-5 bg-slate-100 rounded-md w-16" />
                <div className="h-5 bg-slate-100 rounded-md w-20" />
                <div className="h-5 bg-slate-100 rounded-md w-14" />
              </div>
            </div>

            {/* Bottom: Price + Action Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <div className="h-2.5 bg-slate-100 rounded-md w-12 mb-1" />
                <div className="h-5 bg-slate-200 rounded-md w-24" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DirectorySkeleton;
