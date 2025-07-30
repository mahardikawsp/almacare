'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
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
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = 'btn'
    const variantClasses = buttonVariants[variant]
    const sizeClasses = buttonSizes[size]
    const widthClasses = fullWidth ? 'w-full' : ''
    const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses,
                sizeClasses,
                widthClasses,
                disabledClasses,
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    {icon && iconPosition === 'left' && icon}
                    {children}
                    {icon && iconPosition === 'right' && icon}
                </div>
            )}
        </button>
    )
}