/**
 * BayiCare Baby-Friendly Color Theme
 * 
 * This file documents the custom color theme used throughout the BayiCare application.
 * The colors are designed to be soft, nurturing, and appropriate for a baby care application.
 * Updated with warm, pastel color palette and Nunito font family.
 */

export const theme = {
    colors: {
        // Primary colors - Warm coral/peach (nurturing, caring, warm)
        primary: {
            50: '#fef7f0',
            100: '#fdeee0',
            200: '#fbd9c0',
            300: '#f8c4a0',
            400: '#f5a980',
            500: '#f28e60', // Main primary - warm coral
            600: '#e67c4a',
            700: '#d96a34',
            800: '#cc581e',
            900: '#bf4608',
        },

        // Secondary colors - Soft mint green (growth, health, freshness)
        secondary: {
            50: '#f0fdf8',
            100: '#e0fbf0',
            200: '#c1f7e1',
            300: '#a2f3d2',
            400: '#83efc3',
            500: '#64ebb4', // Main secondary - soft mint
            600: '#4dd9a0',
            700: '#36c78c',
            800: '#1fb578',
            900: '#08a364',
        },

        // Accent colors - Warm lavender (calm, soothing)
        accent: {
            50: '#faf8ff',
            100: '#f5f1ff',
            200: '#ebe3ff',
            300: '#e1d5ff',
            400: '#d7c7ff',
            500: '#cdb9ff', // Main accent - warm lavender
            600: '#b8a0f5',
            700: '#a387eb',
            800: '#8e6ee1',
            900: '#7955d7',
        },

        // Neutral colors - Warm, creamy grays
        neutral: {
            50: '#fdfcfb',
            100: '#faf9f7',
            200: '#f2f0ed',
            300: '#eae7e3',
            400: '#d1ccc4',
            500: '#a8a29e',
            600: '#78716c',
            700: '#57534e',
            800: '#44403c',
            900: '#292524',
        },

        // Status colors - Soft and friendly
        status: {
            success: '#64ebb4',  // Soft mint - success/normal
            warning: '#fbbf24',  // Warm amber - warning
            error: '#f87171',    // Soft coral red - error/alert
            info: '#60a5fa',     // Soft sky blue - info
        },

        // Background colors - Warm and inviting
        background: {
            primary: '#fdfcfb',    // Warm white
            secondary: '#faf9f7',  // Slightly warmer
            accent: '#fef7f0',     // Peachy background
            card: '#ffffff',       // Pure white for cards
        },
    },

    // Typography
    typography: {
        fontFamily: {
            primary: ['Nunito', 'system-ui', 'sans-serif'],
            secondary: ['Nunito Sans', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        },
        fontSize: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            base: '1rem',      // 16px
            lg: '1.125rem',    // 18px
            xl: '1.25rem',     // 20px
            '2xl': '1.5rem',   // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
        },
        fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
        },
    },

    // Semantic color mappings
    semantic: {
        success: '#64ebb4',  // Soft mint
        warning: '#fbbf24',  // Warm amber
        error: '#f87171',    // Soft coral red
        info: '#60a5fa',     // Soft sky blue
    },

    // Component-specific color utilities
    components: {
        button: {
            primary: {
                bg: '#f28e60',      // Warm coral
                hover: '#e67c4a',   // Darker coral
                text: '#ffffff',
            },
            secondary: {
                bg: '#64ebb4',      // Soft mint
                hover: '#4dd9a0',   // Darker mint
                text: '#ffffff',
            },
            accent: {
                bg: '#cdb9ff',      // Warm lavender
                hover: '#b8a0f5',   // Darker lavender
                text: '#ffffff',
            },
            outline: {
                bg: '#ffffff',
                hover: '#faf9f7',
                text: '#57534e',
                border: '#eae7e3',
            },
        },
        card: {
            bg: '#ffffff',
            border: '#f2f0ed',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Softer shadow
        },
        input: {
            bg: '#ffffff',
            border: '#eae7e3',
            focus: '#f28e60',    // Warm coral focus
            placeholder: '#a8a29e',
        },
    },
} as const

/**
 * Growth status color helper
 * Returns appropriate color based on WHO Z-score values
 */
export function getGrowthStatusColor(zScore: number): {
    color: string
    bgColor: string
    borderColor: string
    status: 'normal' | 'warning' | 'alert'
} {
    if (zScore >= -2 && zScore <= 2) {
        return {
            color: theme.colors.status.success,  // Soft mint
            bgColor: '#f0fdf8',
            borderColor: '#c1f7e1',
            status: 'normal',
        }
    } else if ((zScore > -3 && zScore < -2) || (zScore > 2 && zScore < 3)) {
        return {
            color: theme.colors.status.warning,  // Warm amber
            bgColor: '#fffbeb',
            borderColor: '#fed7aa',
            status: 'warning',
        }
    } else {
        return {
            color: theme.colors.status.error,    // Soft coral red
            bgColor: '#fef2f2',
            borderColor: '#fecaca',
            status: 'alert',
        }
    }
}

/**
 * Get immunization status color
 */
export function getImmunizationStatusColor(status: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED') {
    switch (status) {
        case 'COMPLETED':
            return {
                color: theme.colors.status.success,  // Soft mint
                bgColor: '#f0fdf8',
                borderColor: '#c1f7e1',
            }
        case 'SCHEDULED':
            return {
                color: theme.colors.primary[600],     // Warm coral
                bgColor: theme.colors.primary[50],
                borderColor: theme.colors.primary[200],
            }
        case 'OVERDUE':
            return {
                color: theme.colors.status.error,    // Soft coral red
                bgColor: '#fef2f2',
                borderColor: '#fecaca',
            }
        case 'SKIPPED':
            return {
                color: theme.colors.neutral[500],    // Warm gray
                bgColor: theme.colors.neutral[50],
                borderColor: theme.colors.neutral[200],
            }
        default:
            return {
                color: theme.colors.neutral[600],
                bgColor: theme.colors.neutral[50],
                borderColor: theme.colors.neutral[200],
            }
    }
}

export default theme