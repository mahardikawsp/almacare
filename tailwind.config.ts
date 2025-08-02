import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#F1F5FC',
					'100': '#EEF3FC',
					'200': '#D6E4F8',
					'300': '#BDD5F4',
					'400': '#A4C6F0',
					'500': '#04A3E8',
					'600': '#0392D1',
					'700': '#0281BA',
					'800': '#0270A3',
					'900': '#163461',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'50': '#F1F5FC',
					'100': '#EEF3FC',
					'200': '#D6E4F8',
					'300': '#BDD5F4',
					'400': '#A4C6F0',
					'500': '#04A3E8',
					'600': '#0392D1',
					'700': '#0281BA',
					'800': '#0270A3',
					'900': '#163461',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					'50': '#F1F5FC',
					'100': '#EEF3FC',
					'200': '#D6E4F8',
					'300': '#BDD5F4',
					'400': '#A4C6F0',
					'500': '#04A3E8',
					'600': '#0392D1',
					'700': '#0281BA',
					'800': '#0270A3',
					'900': '#163461',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				neutral: {
					'50': '#F1F5FC',
					'100': '#EEF3FC',
					'200': '#E5EBF5',
					'300': '#D1D9E8',
					'400': '#A8B4C8',
					'500': '#7C7D7F',
					'600': '#6B6C6E',
					'700': '#5A5B5D',
					'800': '#494A4C',
					'900': '#163461'
				},
				success: '#04A3E8',
				warning: '#7C7D7F',
				error: '#163461',
				info: '#04A3E8',
				background: 'hsl(var(--background))',
				'berkeley-blue': '#163461',
				'picton-blue': '#04A3E8',
				'alice-blue': '#EEF3FC',
				'alice-blue-2': '#F1F5FC',
				gray: '#7C7D7F',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'Nunito',
					'system-ui',
					'sans-serif'
				],
				display: [
					'Nunito',
					'system-ui',
					'sans-serif'
				],
				body: [
					'Nunito Sans',
					'system-ui',
					'sans-serif'
				],
				mono: [
					'JetBrains Mono',
					'Consolas',
					'monospace'
				]
			},
			fontSize: {
				xs: '0.75rem',
				sm: '0.875rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem'
			},
			fontWeight: {
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800'
			},
			boxShadow: {
				soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
				'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
				warm: '0 4px 6px -1px rgba(242, 142, 96, 0.1), 0 2px 4px -1px rgba(242, 142, 96, 0.06)'
			},
			borderRadius: {
				xl: '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)'
			},
			minHeight: {
				touch: '44px',
				'touch-lg': '48px'
			},
			minWidth: {
				touch: '44px',
				'touch-lg': '48px'
			},
			screens: {
				xs: '475px',
				touch: {
					raw: '(hover: none) and (pointer: coarse)'
				},
				'no-touch': {
					raw: '(hover: hover) and (pointer: fine)'
				},
				'high-contrast': {
					raw: '(prefers-contrast: high)'
				},
				'reduce-motion': {
					raw: '(prefers-reduced-motion: reduce)'
				}
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;