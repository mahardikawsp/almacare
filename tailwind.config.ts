import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Modern baby-friendly color palette
                primary: {
                    50: '#FFF7ED',   // orange-50
                    100: '#FFEDD5',  // orange-100
                    200: '#FED7AA',  // orange-200
                    300: '#FDBA74',  // orange-300
                    400: '#FB923C',  // orange-400
                    500: '#F97316',  // orange-500 (main primary)
                    600: '#EA580C',  // orange-600
                    700: '#C2410C',  // orange-700
                    800: '#9A3412',  // orange-800
                    900: '#7C2D12',  // orange-900
                },
                secondary: {
                    50: '#FDF2F8',   // pink-50
                    100: '#FCE7F3',  // pink-100
                    200: '#FBCFE8',  // pink-200
                    300: '#F9A8D4',  // pink-300
                    400: '#F472B6',  // pink-400
                    500: '#EC4899',  // pink-500
                    600: '#DB2777',  // pink-600
                    700: '#BE185D',  // pink-700
                    800: '#9D174D',  // pink-800
                    900: '#831843',  // pink-900
                },
                accent: {
                    50: '#F0FDF4',   // green-50
                    100: '#DCFCE7',  // green-100
                    200: '#BBF7D0',  // green-200
                    300: '#86EFAC',  // green-300
                    400: '#4ADE80',  // green-400
                    500: '#22C55E',  // green-500
                    600: '#16A34A',  // green-600
                    700: '#15803D',  // green-700
                    800: '#166534',  // green-800
                    900: '#14532D',  // green-900
                },
                neutral: {
                    50: '#F1F5FC',   // alice-blue-2
                    100: '#EEF3FC',  // alice-blue
                    200: '#E5EBF5',
                    300: '#D1D9E8',
                    400: '#A8B4C8',
                    500: '#7C7D7F',  // gray (main neutral)
                    600: '#6B6C6E',
                    700: '#5A5B5D',
                    800: '#494A4C',
                    900: '#163461',  // berkeley-blue
                },
                // Status colors using the same palette
                success: '#04A3E8',
                warning: '#7C7D7F',
                error: '#163461',
                info: '#04A3E8',
                // Background colors
                background: {
                    primary: '#FEFCFB',    // warm white
                    secondary: '#FFF7ED',  // orange-50
                    accent: '#F0FDF4',     // green-50
                    card: '#ffffff',
                },
                // Direct color mappings
                'berkeley-blue': '#163461',
                'picton-blue': '#04A3E8',
                'alice-blue': '#EEF3FC',
                'alice-blue-2': '#F1F5FC',
                'gray': '#7C7D7F',
            },
            fontFamily: {
                sans: ['Nunito', 'system-ui', 'sans-serif'],
                display: ['Nunito', 'system-ui', 'sans-serif'],
                body: ['Nunito Sans', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Consolas', 'monospace'],
            },
            fontSize: {
                'xs': '0.75rem',     // 12px
                'sm': '0.875rem',    // 14px
                'base': '1rem',      // 16px
                'lg': '1.125rem',    // 18px
                'xl': '1.25rem',     // 20px
                '2xl': '1.5rem',     // 24px
                '3xl': '1.875rem',   // 30px
                '4xl': '2.25rem',    // 36px
                '5xl': '3rem',       // 48px
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                'warm': '0 4px 6px -1px rgba(242, 142, 96, 0.1), 0 2px 4px -1px rgba(242, 142, 96, 0.06)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },
            minHeight: {
                'touch': '44px',
                'touch-lg': '48px',
            },
            minWidth: {
                'touch': '44px',
                'touch-lg': '48px',
            },
            screens: {
                'xs': '475px',
                'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
                'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
                'high-contrast': { 'raw': '(prefers-contrast: high)' },
                'reduce-motion': { 'raw': '(prefers-reduced-motion: reduce)' },
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'slide-in': {
                    from: { transform: 'translateX(-100%)', opacity: '0' },
                    to: { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-out': {
                    from: { transform: 'translateX(0)', opacity: '1' },
                    to: { transform: 'translateX(-100%)', opacity: '0' },
                },
                'slide-down-in': {
                    from: {
                        transform: 'translateY(-100%) scale(0.95)',
                        opacity: '0'
                    },
                    to: {
                        transform: 'translateY(0) scale(1)',
                        opacity: '1'
                    },
                },
                'slide-down-out': {
                    from: {
                        transform: 'translateY(0) scale(1)',
                        opacity: '1'
                    },
                    to: {
                        transform: 'translateY(-100%) scale(0.95)',
                        opacity: '0'
                    },
                },
                'slide-up-out': {
                    from: {
                        transform: 'translateY(0) scale(1)',
                        opacity: '1'
                    },
                    to: {
                        transform: 'translateY(-20px) scale(0.95)',
                        opacity: '0'
                    },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-out': {
                    from: { opacity: '1' },
                    to: { opacity: '0' },
                },
                'scale-in': {
                    from: { transform: 'scale(0.95)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
                'scale-out': {
                    from: { transform: 'scale(1)', opacity: '1' },
                    to: { transform: 'scale(0.95)', opacity: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                'slide-out': 'slide-out 0.3s ease-out',
                'slide-down-in': 'slide-down-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-down-out': 'slide-down-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-up-out': 'slide-up-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
                'scale-out': 'scale-out 0.2s ease-out',
            },
        },
    },
    plugins: [],
};
export default config;