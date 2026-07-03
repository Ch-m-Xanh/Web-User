interface CardSkeletonGridProps {
  count?: number;
  aspect?: string;
}

/**
 * Shared loading skeleton used across pages (plant grid, article grid) so
 * the loading state feels consistent everywhere.
 */
export default function CardSkeletonGrid({
  count = 8,
  aspect = 'aspect-[4/3]',
}: CardSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          <div className={`${aspect} w-full animate-pulse bg-gray-200`} />
          <div className="flex flex-col gap-2 p-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
