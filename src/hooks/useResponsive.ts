'use client'

import { useState, useEffect } from 'react'
import { responsive } from '@/lib/accessibility'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface UseResponsiveReturn {
    currentBreakpoint: Breakpoint
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isLargeDesktop: boolean
    matches: (breakpoint: keyof typeof responsive.breakpoints) => boolean
    width: number
    height: number
}

export function useResponsive(): UseResponsiveReturn {
    const [dimensions, setDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    })

    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm')

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            const height = window.innerHeight

            setDimensions({ width, height })
            setCurrentBreakpoint(responsive.getCurrentBreakpoint() as Breakpoint)
        }

        // Set initial values
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const matches = (breakpoint: keyof typeof responsive.breakpoints): boolean => {
        return dimensions.width >= responsive.breakpoints[breakpoint]
    }

    return {
        currentBreakpoint,
        isMobile: dimensions.width < responsive.breakpoints.md,
        isTablet: dimensions.width >= responsive.breakpoints.md && dimensions.width < responsive.breakpoints.lg,
        isDesktop: dimensions.width >= responsive.breakpoints.lg,
        isLargeDesktop: dimensions.width >= responsive.breakpoints.xl,
        matches,
        width: dimensions.width,
        height: dimensions.height
    }
}

// Hook for checking if user prefers reduced motion
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return prefersReducedMotion
}

// Hook for checking if user prefers high contrast
export function usePrefersHighContrast(): boolean {
    const [prefersHighContrast, setPrefersHighContrast] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)')
        setPrefersHighContrast(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersHighContrast(event.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return prefersHighContrast
}

// Hook for checking color scheme preference
export function useColorScheme(): 'light' | 'dark' {
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setColorScheme(mediaQuery.matches ? 'dark' : 'light')

        const handleChange = (event: MediaQueryListEvent) => {
            setColorScheme(event.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return colorScheme
}