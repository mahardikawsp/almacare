/**
 * BayiCare Baby-Friendly Color Theme
 * 
 * This file documents the custom color theme used throughout the BayiCare application.
 * The colors are designed to be soft, nurturing, and appropriate for a baby care application.
 */

export const theme = {
    colors: {
        // Primary colors - Soft blue (trust, calm, medical)
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9', // Main primary color
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },

        // Secondary colors - Soft pink (nurturing, caring, feminine)
        secondary: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899', // Main secondary color
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
        },

        // Accent colors - Soft green (growth, health, positive)
        accent: {
            50: '#f7fee7',
            100: '#ecfccb',
            200: '#d9f99d',
            300: '#bef264',
            400: '#a3e635',
            500: '#84cc16', // Main accent color
            600: '#65a30d',
            700: '#4d7c0f',
            800: '#365314',
            900: '#1a2e05',
        },

        // Neutral colors - Warm grays
        neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
        },

        // Growth status colors for WHO Z-score indicators
        growth: {
            normal: '#10b981',   // Green - Normal growth
            warning: '#f59e0b',  // Yellow - Warning (needs attention)
            alert: '#ef4444',    // Red - Alert (requires immediate attention)
        },
    },

    // Semantic color mappings
    semantic: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
    },

    // Component-specific color utilities
    components: {
        button: {
            primary: {
                bg: '#0ea5e9',
                hover: '#0284c7',
                text: '#ffffff',
            },
            secondary: {
                bg: '#ec4899',
                hover: '#db2777',
                text: '#ffffff',
            },
            outline: {
                bg: '#ffffff',
                hover: '#f9fafb',
                text: '#374151',
                border: '#d1d5db',
            },
        },
        card: {
            bg: '#ffffff',
            border: '#e5e7eb',
            shadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        },
        input: {
            bg: '#ffffff',
            border: '#d1d5db',
            focus: '#0ea5e9',
            placeholder: '#6b7280',
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
            color: theme.colors.growth.normal,
            bgColor: '#f0fdf4',
            borderColor: '#bbf7d0',
            status: 'normal',
        }
    } else if ((zScore > -3 && zScore < -2) || (zScore > 2 && zScore < 3)) {
        return {
            color: theme.colors.growth.warning,
            bgColor: '#fffbeb',
            borderColor: '#fde68a',
            status: 'warning',
        }
    } else {
        return {
            color: theme.colors.growth.alert,
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
                color: theme.colors.growth.normal,
                bgColor: '#f0fdf4',
                borderColor: '#bbf7d0',
            }
        case 'SCHEDULED':
            return {
                color: theme.colors.primary[600],
                bgColor: theme.colors.primary[50],
                borderColor: theme.colors.primary[200],
            }
        case 'OVERDUE':
            return {
                color: theme.colors.growth.alert,
                bgColor: '#fef2f2',
                borderColor: '#fecaca',
            }
        case 'SKIPPED':
            return {
                color: theme.colors.neutral[500],
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