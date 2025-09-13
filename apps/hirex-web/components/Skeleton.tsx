import { Card, CardContent, CardHeader } from "@verse/hirex/components/ui/card";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gradient-to-r from-slate-700/40 via-slate-600/30 to-slate-700/40 ${className}`}
    />
  );
}

export function TaskSkeleton() {
  return (
    <Card className="glass-effect border-white/20 h-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg animate-pulse bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-indigo-600/40" />
          <div className="flex flex-col space-y-2">
            <SkeletonLine className="w-32 h-4" />
            <SkeletonLine className="w-24 h-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SkeletonLine className="w-full h-4" />
        <SkeletonLine className="w-3/4 h-4" />
        <div className="flex gap-2">
          <SkeletonLine className="w-16 h-6" />
          <SkeletonLine className="w-20 h-6" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
