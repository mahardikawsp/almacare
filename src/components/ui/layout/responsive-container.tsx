"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Maximum width variant for the container
     * - sm: 640px (mobile-first)
     * - md: 768px (tablet)
     * - lg: 1024px (desktop)
     * - xl: 1280px (large desktop)
     * - full: 100% width
     */
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full"

    /**
     * Padding variant for different screen sizes
     * - none: no padding
     * - sm: small padding (0.75rem mobile, 1rem desktop)
     * - md: medium padding (1rem mobile, 1.5rem desktop)
     * - lg: large padding (1.5rem mobile, 2rem desktop)
     */
    padding?: "none" | "sm" | "md" | "lg"

    /**
     * Whether to center the container horizontally
     */
    centered?: boolean

    /**
     * Whether to add safe area padding for devices with notches
     */
    safeArea?: boolean
}

const maxWidthVariants = {
    sm: "max-w-sm", // 640px
    md: "max-w-md", // 768px
    lg: "max-w-4xl", // 1024px
    xl: "max-w-6xl", // 1280px
    full: "max-w-full"
}

const paddingVariants = {
    none: "",
    sm: "px-3 sm:px-4", // 12px mobile, 16px desktop
    md: "px-4 sm:px-6", // 16px mobile, 24px desktop
    lg: "px-6 sm:px-8"  // 24px mobile, 32px desktop
}

const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
    ({
        className,
        maxWidth = "lg",
        padding = "md",
        centered = true,
        safeArea = false,
        children,
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Base responsive container styles
                    "w-full",

                    // Max width variants
                    maxWidthVariants[maxWidth],

                    // Padding variants
                    paddingVariants[padding],

                    // Centering
                    centered && "mx-auto",

                    // Safe area handling for devices with notches
                    safeArea && [
                        "pl-[max(1rem,env(safe-area-inset-left))]",
                        "pr-[max(1rem,env(safe-area-inset-right))]",
                        "pt-[max(0.5rem,env(safe-area-inset-top))]",
                        "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
                    ],

                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
ResponsiveContainer.displayName = "ResponsiveContainer"

export { ResponsiveContainer, type ResponsiveContainerProps }