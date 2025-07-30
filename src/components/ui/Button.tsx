'use client'

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { aria, touch } from '@/lib/accessibility'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    ariaLabel?: string
    ariaDescribedBy?: string
}

const buttonVariants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'bg-transparent hover:bg-alice-blue text-gray hover:text-berkeley-blue',
    danger: 'bg-berkeley-blue text-white hover:bg-gray shadow-soft hover:shadow-soft-lg'
}

const buttonSizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-6 py-4 text-base min-h-[48px]'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className,
    disabled,
    ariaLabel,
    ariaDescribedBy,
    ...props
}, ref) => {
    const baseClasses = 'btn'
    const variantClasses = buttonVariants[variant]
    const sizeClasses = buttonSizes[size]
    const widthClasses = fullWidth ? 'w-full' : ''
    const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''

    return (
        <button
            ref={ref}
            className={cn(
                baseClasses,
                variantClasses,
                sizeClasses,
                widthClasses,
                disabledClasses,
                // Enhanced focus styles for accessibility
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                // Touch-friendly sizing
                'touch-manipulation',
                // High contrast mode support
                'forced-colors:border forced-colors:border-[ButtonBorder]',
                className
            )}
            disabled={disabled || loading}
            {...(ariaLabel && aria.label(ariaLabel))}
            {...(ariaDescribedBy && aria.describedBy(ariaDescribedBy))}
            {...(loading && aria.disabled(true))}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                        {...aria.hidden(true)}
                    />
                    <span>Loading...</span>
                    <span className="sr-only">Sedang memuat, mohon tunggu</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    {icon && iconPosition === 'left' && (
                        <span {...aria.hidden(true)}>{icon}</span>
                    )}
                    {children}
                    {icon && iconPosition === 'right' && (
                        <span {...aria.hidden(true)}>{icon}</span>
                    )}
                </div>
            )}
        </button>
    )
})

Button.displayName = 'Button'