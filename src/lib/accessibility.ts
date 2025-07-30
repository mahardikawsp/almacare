/**
 * Accessibility utilities for BayiCare app
 * Provides helper functions for screen readers, keyboard navigation, and ARIA support
 */

// Screen reader utilities
export const screenReader = {
    /**
     * Announce text to screen readers
     */
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', priority)
        announcement.setAttribute('aria-atomic', 'true')
        announcement.setAttribute('class', 'sr-only')
        announcement.textContent = message

        document.body.appendChild(announcement)

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement)
        }, 1000)
    },

    /**
     * Create screen reader only text
     */
    onlyText: (text: string) => ({
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        border: '0',
        children: text
    })
}

// Keyboard navigation utilities
export const keyboard = {
    /**
     * Handle keyboard navigation for interactive elements
     */
    handleKeyDown: (
        event: React.KeyboardEvent,
        callbacks: {
            onEnter?: () => void
            onSpace?: () => void
            onEscape?: () => void
            onArrowUp?: () => void
            onArrowDown?: () => void
            onArrowLeft?: () => void
            onArrowRight?: () => void
            onTab?: () => void
        }
    ) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault()
                callbacks.onEnter?.()
                break
            case ' ':
                event.preventDefault()
                callbacks.onSpace?.()
                break
            case 'Escape':
                event.preventDefault()
                callbacks.onEscape?.()
                break
            case 'ArrowUp':
                event.preventDefault()
                callbacks.onArrowUp?.()
                break
            case 'ArrowDown':
                event.preventDefault()
                callbacks.onArrowDown?.()
                break
            case 'ArrowLeft':
                event.preventDefault()
                callbacks.onArrowLeft?.()
                break
            case 'ArrowRight':
                event.preventDefault()
                callbacks.onArrowRight?.()
                break
            case 'Tab':
                callbacks.onTab?.()
                break
        }
    },

    /**
     * Trap focus within a container
     */
    trapFocus: (container: HTMLElement) => {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus()
                        e.preventDefault()
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus()
                        e.preventDefault()
                    }
                }
            }
        }

        container.addEventListener('keydown', handleTabKey)
        firstElement?.focus()

        return () => {
            container.removeEventListener('keydown', handleTabKey)
        }
    }
}

// ARIA utilities
export const aria = {
    /**
     * Generate unique IDs for ARIA relationships
     */
    generateId: (prefix: string = 'aria') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,

    /**
     * Create ARIA label props
     */
    label: (label: string) => ({
        'aria-label': label
    }),

    /**
     * Create ARIA labelledby props
     */
    labelledBy: (id: string) => ({
        'aria-labelledby': id
    }),

    /**
     * Create ARIA describedby props
     */
    describedBy: (id: string) => ({
        'aria-describedby': id
    }),

    /**
     * Create ARIA expanded props for collapsible content
     */
    expanded: (isExpanded: boolean) => ({
        'aria-expanded': isExpanded
    }),

    /**
     * Create ARIA selected props for selectable items
     */
    selected: (isSelected: boolean) => ({
        'aria-selected': isSelected
    }),

    /**
     * Create ARIA checked props for checkable items
     */
    checked: (isChecked: boolean | 'mixed') => ({
        'aria-checked': isChecked
    }),

    /**
     * Create ARIA disabled props
     */
    disabled: (isDisabled: boolean) => ({
        'aria-disabled': isDisabled
    }),

    /**
     * Create ARIA hidden props
     */
    hidden: (isHidden: boolean) => ({
        'aria-hidden': isHidden
    }),

    /**
     * Create ARIA live region props
     */
    live: (politeness: 'off' | 'polite' | 'assertive' = 'polite') => ({
        'aria-live': politeness,
        'aria-atomic': 'true'
    }),

    /**
     * Create ARIA role props
     */
    role: (role: string) => ({
        role
    })
}

// Touch and mobile utilities
export const touch = {
    /**
     * Check if device supports touch
     */
    isSupported: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,

    /**
     * Get minimum touch target size (44px as per WCAG guidelines)
     */
    minTargetSize: '44px',

    /**
     * Touch-friendly button props
     */
    buttonProps: () => ({
        style: {
            minHeight: '44px',
            minWidth: '44px',
            padding: '12px'
        }
    })
}

// Focus management utilities
export const focus = {
    /**
     * Set focus to element with optional delay
     */
    set: (element: HTMLElement | null, delay: number = 0) => {
        if (!element) return

        if (delay > 0) {
            setTimeout(() => element.focus(), delay)
        } else {
            element.focus()
        }
    },

    /**
     * Create visible focus ring styles
     */
    ring: (color: string = '#04a3e8') => ({
        outline: `2px solid ${color}`,
        outlineOffset: '2px'
    }),

    /**
     * Skip link component props
     */
    skipLink: (targetId: string) => ({
        href: `#${targetId}`,
        className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50',
        children: 'Skip to main content'
    })
}

// Color contrast utilities
export const contrast = {
    /**
     * Check if color combination meets WCAG AA standards
     */
    meetsAA: (foreground: string, background: string): boolean => {
        // This is a simplified check - in production, use a proper contrast ratio calculator
        const fgLuminance = getLuminance(foreground)
        const bgLuminance = getLuminance(background)
        const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05)
        return ratio >= 4.5
    },

    /**
     * Get high contrast color pairs
     */
    highContrast: {
        light: {
            text: '#163461', // berkeley-blue
            background: '#ffffff',
            primary: '#04a3e8', // picton-blue
            error: '#dc2626',
            success: '#059669',
            warning: '#d97706'
        },
        dark: {
            text: '#ffffff',
            background: '#163461', // berkeley-blue
            primary: '#04a3e8', // picton-blue
            error: '#f87171',
            success: '#34d399',
            warning: '#fbbf24'
        }
    }
}

// Helper function for luminance calculation
function getLuminance(color: string): number {
    // Simplified luminance calculation
    // In production, use a proper color library
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    const [rs, gs, bs] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Responsive utilities
const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
} as const

export const responsive = {
    /**
     * Breakpoint values matching Tailwind CSS
     */
    breakpoints,

    /**
     * Check if current viewport matches breakpoint
     */
    matches: (breakpoint: keyof typeof breakpoints): boolean => {
        if (typeof window === 'undefined') return false
        return window.innerWidth >= breakpoints[breakpoint]
    },

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint: (): string => {
        if (typeof window === 'undefined') return 'sm'

        const width = window.innerWidth
        if (width >= breakpoints['2xl']) return '2xl'
        if (width >= breakpoints.xl) return 'xl'
        if (width >= breakpoints.lg) return 'lg'
        if (width >= breakpoints.md) return 'md'
        if (width >= breakpoints.sm) return 'sm'
        return 'xs'
    }
}