import React from "react";

const BookCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-48 w-full animate-pulse bg-gray-200" />

      <div className="space-y-3 p-6">
        
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
  
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-6"
      role="status"
      aria-busy="true"
      aria-label="Loading content"
    >
     
      <div className="relative h-96 w-full animate-pulse overflow-hidden rounded-3xl bg-gray-300">
        <div className="absolute left-12 top-14 w-full max-w-md space-y-4">
     
          <div className="h-8 w-3/4 rounded bg-gray-400/60" />
          <div className="h-4 w-full rounded bg-gray-400/60" />
          <div className="h-4 w-2/3 rounded bg-gray-400/60" />
    
          <div className="mt-4 h-12 w-36 rounded-xl bg-gray-400/60" />
        </div>

    
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-400/70" />
          <div className="h-2 w-2 rounded-full bg-gray-400/70" />
          <div className="h-2 w-2 rounded-full bg-gray-400/70" />
        </div>
      </div>

      <section className="mt-16">
      
        <div className="mb-8 space-y-3">
          <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;