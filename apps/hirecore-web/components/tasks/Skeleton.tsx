import {
  Card,
  CardContent,
  CardHeader,
} from "@verse/ui/components/ui/card";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gradient-to-r from-slate-700/40 via-slate-600/30 to-slate-700/40 ${className}`}
    />
  );
}

export function TaskSkeleton() {
  return (
    <Card className="glass-effect border border-white/10 h-full flex flex-col justify-between shadow-lg rounded-none">
      <CardHeader>
        {/* Header: Icon + Title + Urgency */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl animate-pulse bg-gradient-to-br from-blue-500/40 to-purple-600/40" />
            <div className="flex flex-col space-y-2">
              <SkeletonLine className="w-32 h-4" />
              <SkeletonLine className="w-20 h-3" />
            </div>
          </div>
          <SkeletonLine className="w-14 h-5 rounded-lg" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-grow space-y-5">
        {/* Description */}
        <div className="space-y-2">
          <SkeletonLine className="w-full h-4" />
          <SkeletonLine className="w-5/6 h-4" />
          <SkeletonLine className="w-2/3 h-4" />
        </div>

        {/* Meta Info (MapPin + Clock) */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-4 w-24 justify-self-end" />
        </div>

        {/* Footer (Budget + Button) */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <SkeletonLine className="w-24 h-6 rounded-lg" />
          <SkeletonLine className="w-28 h-8 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
