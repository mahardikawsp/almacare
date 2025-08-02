"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SafeAreaWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Which safe area insets to apply
     * - all: all sides (default)
     * - top: only top inset
     * - bottom: only bottom inset
     * - horizontal: left and right insets
     * - vertical: top and bottom insets
     */
    insets?: "all" | "top" | "bottom" | "horizontal" | "vertical"

    /**
     * Minimum padding to ensure even on devices without safe areas
     */
    minPadding?: {
        top?: string
        bottom?: string
        left?: string
        right?: string
    }

    /**
     * Whether to use padding or margin for safe area handling
     * - padding: uses padding (default, better for backgrounds)
     * - margin: uses margin (better for spacing)
     */
    method?: "padding" | "margin"
}

const SafeAreaWrapper = React.forwardRef<HTMLDivElement, SafeAreaWrapperProps>(
    ({
        className,
        insets = "all",
        minPadding = {
            top: "0.5rem",
            bottom: "0.5rem",
            left: "1rem",
            right: "1rem"
        },
        method = "padding",
        children,
        ...props
    }, ref) => {
        const prefix = method === "padding" ? "p" : "m"

        const getInsetClasses = () => {
            const classes: string[] = []

            switch (insets) {
                case "all":
                    classes.push(
                        `${prefix}t-[max(${minPadding.top || "0.5rem"},env(safe-area-inset-top))]`,
                        `${prefix}b-[max(${minPadding.bottom || "0.5rem"},env(safe-area-inset-bottom))]`,
                        `${prefix}l-[max(${minPadding.left || "1rem"},env(safe-area-inset-left))]`,
                        `${prefix}r-[max(${minPadding.right || "1rem"},env(safe-area-inset-right))]`
                    )
                    break
                case "top":
                    classes.push(`${prefix}t-[max(${minPadding.top || "0.5rem"},env(safe-area-inset-top))]`)
                    break
                case "bottom":
                    classes.push(`${prefix}b-[max(${minPadding.bottom || "0.5rem"},env(safe-area-inset-bottom))]`)
                    break
                case "horizontal":
                    classes.push(
                        `${prefix}l-[max(${minPadding.left || "1rem"},env(safe-area-inset-left))]`,
                        `${prefix}r-[max(${minPadding.right || "1rem"},env(safe-area-inset-right))]`
                    )
                    break
                case "vertical":
                    classes.push(
                        `${prefix}t-[max(${minPadding.top || "0.5rem"},env(safe-area-inset-top))]`,
                        `${prefix}b-[max(${minPadding.bottom || "0.5rem"},env(safe-area-inset-bottom))]`
                    )
                    break
            }

            return classes
        }

        return (
            <div
                ref={ref}
                className={cn(
                    // Base styles
                    "w-full",

                    // Safe area inset classes
                    ...getInsetClasses(),

                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
SafeAreaWrapper.displayName = "SafeAreaWrapper"

export { SafeAreaWrapper, type SafeAreaWrapperProps }