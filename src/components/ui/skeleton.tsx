import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Accessible label for screen readers
   */
  "aria-label"?: string
  /**
   * Whether to show a shimmer effect
   */
  shimmer?: boolean
  /**
   * Predefined skeleton variants for common use cases
   */
  variant?: "text" | "circular" | "rectangular" | "card" | "avatar"
}

function Skeleton({
  className,
  shimmer = true,
  variant = "rectangular",
  "aria-label": ariaLabel = "Loading content",
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "h-12 w-12 rounded-full",
    rectangular: "h-4 w-full rounded-md",
    card: "h-32 w-full rounded-lg",
    avatar: "h-10 w-10 rounded-full"
  }

  return (
    <div
      className={cn(
        "bg-muted",
        shimmer && "animate-pulse",
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      {...props}
    />
  )
}

/**
 * Skeleton component for text content with proper line spacing
 */
function SkeletonText({
  lines = 1,
  className,
  ...props
}: {
  lines?: number
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 && lines > 1 && "w-3/4" // Last line shorter
          )}
          aria-label={`Loading text line ${i + 1} of ${lines}`}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton component for card layouts
 */
function SkeletonCard({
  showAvatar = false,
  showActions = false,
  className,
  ...props
}: {
  showAvatar?: boolean
  showActions?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-4 space-y-4 bg-card rounded-lg border", className)}
      role="status"
      aria-label="Loading card content"
      {...props}
    >
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <Skeleton variant="avatar" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <SkeletonText lines={3} />
      </div>
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton component for health data cards (BayiCare specific)
 */
function SkeletonHealthCard({
  type = "growth",
  className,
  ...props
}: {
  type?: "growth" | "immunization" | "mpasi"
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-4 space-y-4 bg-card rounded-lg border", className)}
      role="status"
      aria-label={`Loading ${type} data`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-8 w-8" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {type === "growth" && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      )}

      {type === "immunization" && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded border">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {type === "mpasi" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded" />
            ))}
          </div>
          <SkeletonText lines={2} />
        </div>
      )}
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonHealthCard }
