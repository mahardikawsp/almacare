'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon, ChevronRight } from 'lucide-react'

interface QuickActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    icon: LucideIcon
    iconColor?: string
    iconBgColor?: string
    badge?: {
        text: string
        color?: string
        bgColor?: string
    }
    disabled?: boolean
    loading?: boolean
    onAction?: () => void
    href?: string
    priority?: 'high' | 'medium' | 'low'
}

const QuickActionCard = React.forwardRef<HTMLDivElement, QuickActionCardProps>(
    ({
        className,
        title,
        description,
        icon: Icon,
        iconColor = 'text-picton-blue',
        iconBgColor = 'bg-blue-100',
        badge,
        disabled = false,
        loading = false,
        onAction,
        href,
        priority = 'medium',
        ...props
    }, ref) => {
        const handleClick = () => {
            if (disabled || loading) return

            // Add haptic feedback for supported devices
            if ('vibrate' in navigator) {
                navigator.vibrate(10) // Short vibration
            }

            if (href) {
                window.location.href = href
            } else if (onAction) {
                onAction()
            }
        }

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleClick()
            }
        }

        const getPriorityStyles = () => {
            switch (priority) {
                case 'high':
                    return 'ring-2 ring-red-200 border-red-200 hover:ring-red-300'
                case 'low':
                    return 'border-gray-200 hover:border-gray-300'
                default:
                    return 'border-alice-blue hover:border-picton-blue/30'
            }
        }

        const getLoadingIcon = () => (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-picton-blue" />
        )

        return (
            <Card
                ref={ref}
                className={cn(
                    // Base styles
                    "relative cursor-pointer transition-all duration-200 select-none",
                    // Touch-friendly sizing
                    "min-h-touch min-w-touch",
                    // Interactive states
                    "hover:shadow-soft-lg hover:-translate-y-0.5",
                    "active:scale-[0.98] touch:active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-picton-blue focus-visible:ring-offset-2",
                    // Priority-based styling
                    getPriorityStyles(),
                    // Disabled state
                    disabled && "opacity-50 cursor-not-allowed hover:shadow-soft hover:translate-y-0 active:scale-100",
                    // Loading state
                    loading && "cursor-wait",
                    className
                )}
                variant="interactive"
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label={`${title}${description ? `: ${description}` : ''}`}
                aria-disabled={disabled}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                {...props}
            >
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            {/* Icon */}
                            <div className={cn(
                                "flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors",
                                iconBgColor,
                                disabled && "opacity-70"
                            )}>
                                {loading ? getLoadingIcon() : (
                                    <Icon className={cn(
                                        "w-6 h-6 sm:w-7 sm:h-7",
                                        iconColor,
                                        disabled && "opacity-70"
                                    )} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={cn(
                                        "font-semibold text-berkeley-blue truncate",
                                        "text-base sm:text-lg",
                                        disabled && "text-gray-400"
                                    )}>
                                        {title}
                                    </h3>

                                    {/* Badge */}
                                    {badge && (
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
                                            badge.bgColor || "bg-red-100",
                                            badge.color || "text-red-700"
                                        )}>
                                            {badge.text}
                                        </span>
                                    )}
                                </div>

                                {description && (
                                    <p className={cn(
                                        "text-sm text-gray-600 line-clamp-2",
                                        disabled && "text-gray-400"
                                    )}>
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Arrow indicator */}
                        <ChevronRight className={cn(
                            "w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform group-hover:translate-x-1",
                            disabled && "opacity-50"
                        )} />
                    </div>

                    {/* High priority indicator */}
                    {priority === 'high' && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </CardContent>
            </Card>
        )
    }
)

QuickActionCard.displayName = 'QuickActionCard'

export { QuickActionCard }