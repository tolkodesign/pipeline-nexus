import React from 'react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 dark:bg-white/[0.04] ${className}`}
      {...props}
    />
  );
}