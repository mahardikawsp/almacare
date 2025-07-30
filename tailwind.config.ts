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
                // Warm, nurturing color palette for BayiCare
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
                // Status colors
                success: '#64ebb4',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa',
                // Background colors
                background: {
                    primary: '#fdfcfb',
                    secondary: '#faf9f7',
                    accent: '#fef7f0',
                    card: '#ffffff',
                },
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
        },
    },
    plugins: [],
};
export default config;