"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for loading transition components
 */
interface LoadingTransitionProps {
    /**
     * Whether the content is currently loading
     */
    loading: boolean
    /**
     * Loading component to show during loading state
     */
    loadingComponent: React.ReactNode
    /**
     * Content to show when loaded
     */
    children: React.ReactNode
    /**
     * Duration of the transition in milliseconds
     */
    duration?: number
    /**
     * Additional CSS classes
     */
    className?: string
    /**
     * Delay before showing loading state (prevents flash for quick loads)
     */
    delay?: number
    /**
     * Whether to respect reduced motion preferences
     */
    respectReducedMotion?: boolean
}

/**
 * Smooth transition between loading and loaded states with fade effect
 */
function FadeTransition({
    loading,
    loadingComponent,
    children,
    duration = 300,
    className,
    delay = 100,
    respectReducedMotion = true
}: LoadingTransitionProps) {
    const [showLoading, setShowLoading] = React.useState(loading)
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Handle reduced motion preference
    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined") return false
        return respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }, [respectReducedMotion])

    const transitionDuration = prefersReducedMotion ? 0 : duration

    React.useEffect(() => {
        if (loading) {
            // Show loading state after delay to prevent flash
            timeoutRef.current = setTimeout(() => {
                setShowLoading(true)
            }, delay)
        } else {
            // Clear delay timeout if loading finishes quickly
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            if (showLoading) {
                setIsTransitioning(true)
                setTimeout(() => {
                    setShowLoading(false)
                    setIsTransitioning(false)
                }, transitionDuration)
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [loading, delay, transitionDuration, showLoading])

    const transitionStyle = {
        transition: prefersReducedMotion ? "none" : `opacity ${transitionDuration}ms ease-in-out`,
        opacity: isTransitioning ? 0 : 1
    }

    return (
        <div className={cn("relative", className)} style={transitionStyle}>
            {showLoading ? loadingComponent : children}
        </div>
    )
}

/**
 * Slide transition between loading and loaded states
 */
function SlideTransition({
    loading,
    loadingComponent,
    children,
    duration = 300,
    className,
    delay = 100,
    respectReducedMotion = true,
    direction = "up"
}: LoadingTransitionProps & { direction?: "up" | "down" | "left" | "right" }) {
    const [showLoading, setShowLoading] = React.useState(loading)
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined") return false
        return respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }, [respectReducedMotion])

    const transitionDuration = prefersReducedMotion ? 0 : duration

    React.useEffect(() => {
        if (loading) {
            timeoutRef.current = setTimeout(() => {
                setShowLoading(true)
            }, delay)
        } else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            if (showLoading) {
                setIsTransitioning(true)
                setTimeout(() => {
                    setShowLoading(false)
                    setIsTransitioning(false)
                }, transitionDuration)
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [loading, delay, transitionDuration, showLoading])

    const getTransform = () => {
        if (prefersReducedMotion || !isTransitioning) return "none"

        switch (direction) {
            case "up":
                return "translateY(-10px)"
            case "down":
                return "translateY(10px)"
            case "left":
                return "translateX(-10px)"
            case "right":
                return "translateX(10px)"
            default:
                return "translateY(-10px)"
        }
    }

    const transitionStyle = {
        transition: prefersReducedMotion
            ? "none"
            : `opacity ${transitionDuration}ms ease-in-out, transform ${transitionDuration}ms ease-in-out`,
        opacity: isTransitioning ? 0 : 1,
        transform: getTransform()
    }

    return (
        <div className={cn("relative", className)} style={transitionStyle}>
            {showLoading ? loadingComponent : children}
        </div>
    )
}

/**
 * Progressive loading transition that reveals content in stages
 */
interface ProgressiveLoadingProps {
    /**
     * Array of loading states and their corresponding content
     */
    stages: Array<{
        loading: boolean
        loadingComponent: React.ReactNode
        content: React.ReactNode
        label?: string
    }>
    /**
     * Duration of each transition
     */
    duration?: number
    /**
     * Additional CSS classes
     */
    className?: string
    /**
     * Whether to respect reduced motion preferences
     */
    respectReducedMotion?: boolean
}

function ProgressiveLoading({
    stages,
    duration = 300,
    className,
    respectReducedMotion = true
}: ProgressiveLoadingProps) {
    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined") return false
        return respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }, [respectReducedMotion])

    const transitionDuration = prefersReducedMotion ? 0 : duration

    return (
        <div className={cn("space-y-4", className)}>
            {stages.map((stage, index) => (
                <div
                    key={index}
                    className="transition-all duration-300 ease-in-out"
                    style={{
                        transition: prefersReducedMotion
                            ? "none"
                            : `opacity ${transitionDuration}ms ease-in-out, transform ${transitionDuration}ms ease-in-out`,
                        opacity: stage.loading ? 0.7 : 1,
                        transform: stage.loading ? "scale(0.98)" : "scale(1)"
                    }}
                    role="region"
                    aria-label={stage.label || `Content section ${index + 1}`}
                    aria-busy={stage.loading}
                >
                    {stage.loading ? stage.loadingComponent : stage.content}
                </div>
            ))}
        </div>
    )
}

/**
 * Skeleton to content transition with morphing effect
 */
interface SkeletonMorphProps {
    /**
     * Whether content is loading
     */
    loading: boolean
    /**
     * Skeleton component dimensions and shape
     */
    skeleton: {
        width?: string | number
        height?: string | number
        className?: string
    }
    /**
     * Content to show when loaded
     */
    children: React.ReactNode
    /**
     * Duration of the morph transition
     */
    duration?: number
    /**
     * Additional CSS classes
     */
    className?: string
    /**
     * Whether to respect reduced motion preferences
     */
    respectReducedMotion?: boolean
}

function SkeletonMorph({
    loading,
    skeleton,
    children,
    duration = 400,
    className,
    respectReducedMotion = true
}: SkeletonMorphProps) {
    const [isTransitioning, setIsTransitioning] = React.useState(false)
    const [showContent, setShowContent] = React.useState(!loading)

    const prefersReducedMotion = React.useMemo(() => {
        if (typeof window === "undefined") return false
        return respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }, [respectReducedMotion])

    const transitionDuration = prefersReducedMotion ? 0 : duration

    React.useEffect(() => {
        if (!loading && !showContent) {
            setIsTransitioning(true)
            setTimeout(() => {
                setShowContent(true)
                setIsTransitioning(false)
            }, transitionDuration / 2)
        } else if (loading && showContent) {
            setShowContent(false)
        }
    }, [loading, showContent, transitionDuration])

    const containerStyle = {
        transition: prefersReducedMotion
            ? "none"
            : `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        width: skeleton.width,
        height: skeleton.height
    }

    if (loading || !showContent) {
        return (
            <div
                className={cn(
                    "animate-pulse rounded-md bg-muted",
                    skeleton.className,
                    isTransitioning && "animate-pulse",
                    className
                )}
                style={containerStyle}
                role="status"
                aria-label="Loading content"
            />
        )
    }

    return (
        <div
            className={cn(
                "transition-all duration-400 ease-out",
                isTransitioning && "animate-fade-in",
                className
            )}
            style={{
                transition: prefersReducedMotion
                    ? "none"
                    : `opacity ${transitionDuration}ms ease-out, transform ${transitionDuration}ms ease-out`,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? "scale(0.95)" : "scale(1)"
            }}
        >
            {children}
        </div>
    )
}

/**
 * Higher-order component for adding loading transitions to any component
 */
function withLoadingTransition<P extends object>(
    Component: React.ComponentType<P>,
    LoadingComponent: React.ComponentType<Record<string, unknown>>,
    transitionType: "fade" | "slide" = "fade"
) {
    const WrappedComponent = React.forwardRef<unknown, P & { loading?: boolean; transitionDuration?: number }>(
        ({ loading = false, transitionDuration = 300, ...props }, ref) => {
            const TransitionComponent = transitionType === "fade" ? FadeTransition : SlideTransition

            return (
                <TransitionComponent
                    loading={loading}
                    duration={transitionDuration}
                    loadingComponent={<LoadingComponent />}
                >
                    <Component ref={ref} {...(props as P)} />
                </TransitionComponent>
            )
        }
    )

    WrappedComponent.displayName = `withLoadingTransition(${Component.displayName || Component.name})`

    return WrappedComponent
}

export {
    FadeTransition,
    SlideTransition,
    ProgressiveLoading,
    SkeletonMorph,
    withLoadingTransition
}