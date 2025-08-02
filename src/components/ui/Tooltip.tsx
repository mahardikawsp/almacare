'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
    children: React.ReactNode
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
    className?: string
}

export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 500,
    className
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const showTooltip = () => {
        const id = setTimeout(() => {
            setIsVisible(true)
        }, delay)
        setTimeoutId(id)
    }

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
            setTimeoutId(null)
        }
        setIsVisible(false)
    }

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    }

    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-primary-900',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-primary-900',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-primary-900',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-primary-900',
    }

    return (
        <div
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={cn(
                        'absolute z-50 px-3 py-2 text-sm text-white bg-primary-900 rounded-lg shadow-lg whitespace-nowrap animate-fade-in',
                        positionClasses[position],
                        className
                    )}
                    role="tooltip"
                >
                    {content}
                    <div
                        className={cn(
                            'absolute w-0 h-0 border-4',
                            arrowClasses[position]
                        )}
                    />
                </div>
            )}
        </div>
    )
}

// Simple tooltip hook for programmatic use
export function useTooltip() {
    const [isVisible, setIsVisible] = useState(false)
    const [content, setContent] = useState('')
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const showTooltip = (text: string, event: React.MouseEvent) => {
        setContent(text)
        setPosition({ x: event.clientX, y: event.clientY })
        setIsVisible(true)
    }

    const hideTooltip = () => {
        setIsVisible(false)
    }

    const TooltipComponent = () => {
        if (!isVisible) return null

        return (
            <div
                className="fixed z-50 px-3 py-2 text-sm text-white bg-primary-900 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none"
                style={{
                    left: position.x + 10,
                    top: position.y - 40,
                }}
            >
                {content}
            </div>
        )
    }

    return {
        showTooltip,
        hideTooltip,
        TooltipComponent,
    }
}