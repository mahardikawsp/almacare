"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * Progress variant for different use cases
   */
  variant?: "default" | "success" | "warning" | "error"
  /**
   * Size of the progress bar
   */
  size?: "sm" | "default" | "lg"
  /**
   * Whether to show the progress value as text
   */
  showValue?: boolean
  /**
   * Custom label for accessibility
   */
  label?: string
  /**
   * Whether to animate the progress bar
   */
  animated?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value,
  variant = "default",
  size = "default",
  showValue = false,
  label,
  animated = true,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "h-2",
    default: "h-4",
    lg: "h-6"
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  }

  const progressValue = value || 0
  const progressLabel = label || `Progress: ${Math.round(progressValue)}%`

  return (
    <div className="w-full space-y-2">
      {(showValue || label) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showValue && (
            <span className="text-muted-foreground" aria-hidden="true">
              {Math.round(progressValue)}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-secondary",
          sizeClasses[size],
          className
        )}
        aria-label={progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1",
            variantClasses[variant],
            animated && "transition-all duration-500 ease-out"
          )}
          style={{ transform: `translateX(-${100 - progressValue}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

/**
 * Circular progress component for loading states
 */
interface CircularProgressProps {
  /**
   * Progress value (0-100)
   */
  value?: number
  /**
   * Size of the circular progress
   */
  size?: number
  /**
   * Stroke width
   */
  strokeWidth?: number
  /**
   * Color variant
   */
  variant?: "default" | "success" | "warning" | "error"
  /**
   * Whether to show the progress value in the center
   */
  showValue?: boolean
  /**
   * Custom label for accessibility
   */
  label?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

function CircularProgress({
  value = 0,
  size = 40,
  strokeWidth = 4,
  variant = "default",
  showValue = false,
  label,
  className
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  const variantColors = {
    default: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500"
  }

  const progressLabel = label || `Circular progress: ${Math.round(value)}%`

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-label={progressLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", variantColors[variant])}
        />
      </svg>
      {showValue && (
        <span
          className="absolute text-xs font-medium text-foreground"
          aria-hidden="true"
        >
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}

/**
 * Loading spinner component
 */
interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: "sm" | "default" | "lg"
  /**
   * Color variant
   */
  variant?: "default" | "muted"
  /**
   * Custom label for accessibility
   */
  label?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

function LoadingSpinner({
  size = "default",
  variant = "default",
  label = "Loading",
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  }

  const variantClasses = {
    default: "text-primary",
    muted: "text-muted-foreground"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { Progress, CircularProgress, LoadingSpinner }
