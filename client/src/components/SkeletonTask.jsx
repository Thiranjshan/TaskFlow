export default function SkeletonTask({ count = 3 }) {
  return (
    <div className="skeleton-container" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-checkbox shimmer"></div>
          <div className="skeleton-body">
            <div className="skeleton-line shimmer title"></div>
            <div className="skeleton-line shimmer subtitle"></div>
          </div>
          <div className="skeleton-action shimmer"></div>
        </div>
      ))}
    </div>
  );
}
