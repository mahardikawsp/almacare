"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavItem {
    href: string
    label: string
    icon: React.ReactNode
    badge?: string | number
}

interface MobileNavProps {
    items: MobileNavItem[]
    className?: string
}

const MobileNav = React.forwardRef<HTMLElement, MobileNavProps>(
    ({ items, className }, ref) => {
        const pathname = usePathname()

        return (
            <nav
                ref={ref}
                className={cn(
                    // Fixed positioning at bottom with shadcn/ui styling
                    "fixed bottom-0 left-0 right-0 z-50",

                    // Modern shadcn/ui background with better contrast
                    "bg-card/95 backdrop-blur-md border-t border-border",
                    "shadow-lg",

                    // Safe area handling for devices with home indicators
                    "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
                    "pl-[max(0.5rem,env(safe-area-inset-left))]",
                    "pr-[max(0.5rem,env(safe-area-inset-right))]",

                    // Hide on larger screens
                    "block md:hidden",

                    className
                )}
            >
                <div className="flex items-center justify-around px-1 py-2">
                    {items.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname?.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    // Base button styles with shadcn/ui design
                                    "relative flex flex-col items-center justify-center",
                                    "min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl",
                                    "transition-all duration-200 ease-out",
                                    "text-xs font-medium",

                                    // Active state with primary colors
                                    isActive ? [
                                        "text-primary bg-primary/10",
                                        "shadow-sm scale-105"
                                    ] : [
                                        "text-muted-foreground hover:text-foreground",
                                        "hover:bg-accent/50 hover:scale-105"
                                    ],

                                    // Focus styles for accessibility
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {/* Icon container with enhanced styling */}
                                <div className={cn(
                                    "flex items-center justify-center mb-1 relative",
                                    "h-6 w-6",
                                    // Add subtle background for active state
                                    isActive && "drop-shadow-sm"
                                )}>
                                    {item.icon}

                                    {/* Badge for notifications/counts */}
                                    {item.badge && (
                                        <span className={cn(
                                            "absolute -top-1 -right-1",
                                            "flex items-center justify-center",
                                            "min-w-[16px] h-4 px-1",
                                            "text-[10px] font-bold text-primary-foreground",
                                            "bg-destructive rounded-full",
                                            "border border-background shadow-sm"
                                        )}>
                                            {typeof item.badge === "number" && item.badge > 99 ? "99+" : item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Label with better typography */}
                                <span className={cn(
                                    "leading-none text-center",
                                    isActive && "font-semibold"
                                )}>
                                    {item.label}
                                </span>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        )
    }
)
MobileNav.displayName = "MobileNav"

export { MobileNav, type MobileNavProps, type MobileNavItem }