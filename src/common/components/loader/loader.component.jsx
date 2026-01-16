import React from "react";

function Loader({
  loading,
  size = 1,
  color = "indigo-600",
  variant = "default",
}) {
  if (!loading) return null;

  // Skeleton loader variants
  if (variant === "table") {
    return (
      <div className="animate-pulse space-y-3 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-8 w-1/2 rounded bg-gray-200"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="animate-pulse space-y-4 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default skeleton - shows shimmer effect with multiple lines
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="relative overflow-hidden rounded-lg bg-gray-50 p-6">
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
