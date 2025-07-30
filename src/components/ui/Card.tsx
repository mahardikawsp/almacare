'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'interactive'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    as?: 'div' | 'article' | 'section'
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    as?: 'div' | 'header'
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    as?: 'div' | 'main'
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    as?: 'div' | 'footer'
}

const cardVariants = {
    default: 'bg-white border border-neutral-200 shadow-soft',
    elevated: 'bg-white shadow-soft-lg border border-neutral-100',
    outlined: 'bg-white border-2 border-neutral-300',
    interactive: 'bg-white border border-neutral-200 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
}

const cardPadding = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
    variant = 'default',
    padding = 'md',
    as: Component = 'div',
    className,
    children,
    ...props
}, ref) => {
    return (
        <Component
            ref={ref}
            className={cn(
                'rounded-2xl',
                cardVariants[variant],
                cardPadding[padding],
                // High contrast mode support
                'forced-colors:border forced-colors:border-[FieldBorder]',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
})

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
    as: Component = 'div',
    className,
    children,
    ...props
}, ref) => {
    return (
        <Component
            ref={ref}
            className={cn('mb-4', className)}
            {...props}
        >
            {children}
        </Component>
    )
})

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
    as: Component = 'div',
    className,
    children,
    ...props
}, ref) => {
    return (
        <Component
            ref={ref}
            className={cn('', className)}
            {...props}
        >
            {children}
        </Component>
    )
})

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
    as: Component = 'div',
    className,
    children,
    ...props
}, ref) => {
    return (
        <Component
            ref={ref}
            className={cn('mt-4 pt-4 border-t border-neutral-200', className)}
            {...props}
        >
            {children}
        </Component>
    )
})

CardFooter.displayName = 'CardFooter'