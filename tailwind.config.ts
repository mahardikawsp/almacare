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
                // BayiCare unified color palette
                primary: {
                    50: '#F1F5FC',   // alice-blue-2 (lightest)
                    100: '#EEF3FC',  // alice-blue
                    200: '#D6E4F8',
                    300: '#BDD5F4',
                    400: '#A4C6F0',
                    500: '#04A3E8',  // picton-blue (main primary)
                    600: '#0392D1',
                    700: '#0281BA',
                    800: '#0270A3',
                    900: '#163461',  // berkeley-blue (darkest)
                },
                secondary: {
                    50: '#F1F5FC',   // alice-blue-2
                    100: '#EEF3FC',  // alice-blue
                    200: '#D6E4F8',
                    300: '#BDD5F4',
                    400: '#A4C6F0',
                    500: '#04A3E8',  // picton-blue
                    600: '#0392D1',
                    700: '#0281BA',
                    800: '#0270A3',
                    900: '#163461',  // berkeley-blue
                },
                accent: {
                    50: '#F1F5FC',   // alice-blue-2
                    100: '#EEF3FC',  // alice-blue
                    200: '#D6E4F8',
                    300: '#BDD5F4',
                    400: '#A4C6F0',
                    500: '#04A3E8',  // picton-blue
                    600: '#0392D1',
                    700: '#0281BA',
                    800: '#0270A3',
                    900: '#163461',  // berkeley-blue
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
                    primary: '#F1F5FC',    // alice-blue-2
                    secondary: '#EEF3FC',  // alice-blue
                    accent: '#F1F5FC',     // alice-blue-2
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
        },
    },
    plugins: [],
};
export default config;