import { Skeleton } from '../ui/Skeleton';

export default function RequestRowSkeleton() {
  return (
    <div className="bg-white dark:bg-luxury-card border border-gray-200 dark:border-luxury-border p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
      <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
      
      <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0 justify-end">
         <Skeleton className="w-10 h-10 rounded-xl" />
         <Skeleton className="w-10 h-10 rounded-xl" />
         <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}