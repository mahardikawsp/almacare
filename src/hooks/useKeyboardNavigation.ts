'use client'

import { useEffect, useCallback, useRef } from 'react'
import { keyboard } from '@/lib/accessibility'

interface UseKeyboardNavigationOptions {
    onEscape?: () => void
    onEnter?: () => void
    onSpace?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
    enabled?: boolean
    preventDefault?: boolean
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
    const {
        onEscape,
        onEnter,
        onSpace,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onTab,
        enabled = true,
        preventDefault = true
    } = options

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return

        // Handle keyboard events directly
        switch (event.key) {
            case 'Enter':
                if (preventDefault) event.preventDefault()
                onEnter?.()
                break
            case ' ':
                if (preventDefault) event.preventDefault()
                onSpace?.()
                break
            case 'Escape':
                if (preventDefault) event.preventDefault()
                onEscape?.()
                break
            case 'ArrowUp':
                if (preventDefault) event.preventDefault()
                onArrowUp?.()
                break
            case 'ArrowDown':
                if (preventDefault) event.preventDefault()
                onArrowDown?.()
                break
            case 'ArrowLeft':
                if (preventDefault) event.preventDefault()
                onArrowLeft?.()
                break
            case 'ArrowRight':
                if (preventDefault) event.preventDefault()
                onArrowRight?.()
                break
            case 'Tab':
                onTab?.()
                break
        }
    }, [enabled, preventDefault, onEscape, onEnter, onSpace, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab])

    useEffect(() => {
        if (!enabled) return

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown, enabled])

    return { handleKeyDown }
}

// Hook for managing focus trap in modals/dropdowns
export function useFocusTrap(isActive: boolean = false) {
    const containerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!isActive || !containerRef.current) return

        const cleanup = keyboard.trapFocus(containerRef.current)
        return cleanup
    }, [isActive])

    return containerRef
}

// Hook for managing roving tabindex (for lists, menus, etc.)
export function useRovingTabIndex<T extends HTMLElement>(
    items: T[],
    initialIndex: number = 0,
    options: {
        orientation?: 'horizontal' | 'vertical' | 'both'
        loop?: boolean
        onSelectionChange?: (index: number) => void
    } = {}
) {
    const { orientation = 'vertical', loop = true, onSelectionChange } = options
    const currentIndexRef = useRef(initialIndex)

    const setTabIndex = useCallback((index: number) => {
        items.forEach((item, i) => {
            if (item) {
                item.tabIndex = i === index ? 0 : -1
            }
        })
        currentIndexRef.current = index
        onSelectionChange?.(index)
    }, [items, onSelectionChange])

    const moveToNext = useCallback(() => {
        const nextIndex = currentIndexRef.current + 1
        if (nextIndex < items.length) {
            setTabIndex(nextIndex)
            items[nextIndex]?.focus()
        } else if (loop) {
            setTabIndex(0)
            items[0]?.focus()
        }
    }, [items, loop, setTabIndex])

    const moveToPrevious = useCallback(() => {
        const prevIndex = currentIndexRef.current - 1
        if (prevIndex >= 0) {
            setTabIndex(prevIndex)
            items[prevIndex]?.focus()
        } else if (loop) {
            const lastIndex = items.length - 1
            setTabIndex(lastIndex)
            items[lastIndex]?.focus()
        }
    }, [items, loop, setTabIndex])

    const moveToFirst = useCallback(() => {
        setTabIndex(0)
        items[0]?.focus()
    }, [items, setTabIndex])

    const moveToLast = useCallback(() => {
        const lastIndex = items.length - 1
        setTabIndex(lastIndex)
        items[lastIndex]?.focus()
    }, [items, setTabIndex])

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                if (orientation === 'vertical' || orientation === 'both') {
                    event.preventDefault()
                    moveToNext()
                }
                break
            case 'ArrowUp':
                if (orientation === 'vertical' || orientation === 'both') {
                    event.preventDefault()
                    moveToPrevious()
                }
                break
            case 'ArrowRight':
                if (orientation === 'horizontal' || orientation === 'both') {
                    event.preventDefault()
                    moveToNext()
                }
                break
            case 'ArrowLeft':
                if (orientation === 'horizontal' || orientation === 'both') {
                    event.preventDefault()
                    moveToPrevious()
                }
                break
            case 'Home':
                event.preventDefault()
                moveToFirst()
                break
            case 'End':
                event.preventDefault()
                moveToLast()
                break
        }
    }, [orientation, moveToNext, moveToPrevious, moveToFirst, moveToLast])

    // Initialize tabindex
    useEffect(() => {
        setTabIndex(initialIndex)
    }, [initialIndex, setTabIndex])

    return {
        currentIndex: currentIndexRef.current,
        setTabIndex,
        moveToNext,
        moveToPrevious,
        moveToFirst,
        moveToLast,
        handleKeyDown
    }
}