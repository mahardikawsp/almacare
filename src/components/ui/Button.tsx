'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation',
    {
        variants: {
            variant: {
                default: 'bg-gradient-to-r from-picton-blue to-berkeley-blue text-white shadow-soft hover:from-blue-500 hover:to-blue-800 hover:shadow-soft-lg hover:-translate-y-0.5',
                destructive: 'bg-red-500 text-white shadow-soft hover:bg-red-600 hover:shadow-soft-lg hover:-translate-y-0.5',
                outline: 'border border-alice-blue bg-white text-berkeley-blue shadow-soft hover:bg-alice-blue hover:border-picton-blue',
                secondary: 'bg-berkeley-blue text-white shadow-soft hover:bg-blue-800 hover:shadow-soft-lg hover:-translate-y-0.5',
                ghost: 'text-berkeley-blue hover:bg-alice-blue hover:text-berkeley-blue',
                link: 'text-picton-blue underline-offset-4 hover:underline',
                primary: 'bg-gradient-to-r from-picton-blue to-berkeley-blue text-white shadow-soft hover:from-blue-500 hover:to-blue-800 hover:shadow-soft-lg hover:-translate-y-0.5'
            },
            size: {
                default: 'h-11 px-6 py-3 min-h-[44px]',
                sm: 'h-9 px-4 py-2 text-xs min-h-[40px]',
                lg: 'h-12 px-8 py-4 text-base min-h-[48px]',
                icon: 'h-11 w-11 min-h-[44px] min-w-[44px]'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="sr-only">Loading...</span>
                        {children && <span>Loading...</span>}
                    </>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                        {children}
                        {icon && iconPosition === 'right' && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                    </>
                )}
            </Comp>
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }