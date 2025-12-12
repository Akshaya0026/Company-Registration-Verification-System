export default function SkeletonRow({ lines = 2 }) {
  return (
    <div className="card mb-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="skeleton h-4 w-1/3 mb-3"></div>
          <div className="skeleton h-3 w-2/3"></div>
        </div>
        <div className="w-32 flex flex-col gap-2">
          <div className="skeleton h-8 w-full rounded"></div>
          <div className="skeleton h-8 w-full rounded"></div>
        </div>
      </div>
    </div>
  );
}
