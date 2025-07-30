'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { aria } from '@/lib/accessibility'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    id,
    required,
    disabled,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || aria.generateId('input')
    const errorId = error ? aria.generateId('error') : undefined
    const helperTextId = helperText ? aria.generateId('helper') : undefined

    const describedByIds = [errorId, helperTextId].filter(Boolean).join(' ')

    return (
        <div className={cn('space-y-2', fullWidth && 'w-full')}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        'block text-sm font-medium transition-colors',
                        error ? 'text-red-600' : 'text-berkeley-blue',
                        disabled && 'text-neutral-400'
                    )}
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1" aria-label="required">*</span>
                    )}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        // Base styles
                        'w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200',
                        'placeholder:text-neutral-400',
                        // Focus styles
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        // Mobile optimization
                        'text-base sm:text-sm', // Prevent zoom on iOS
                        'min-h-[44px]', // Touch-friendly height
                        // Icon padding
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        // State styles
                        error
                            ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                            : 'border-neutral-300 bg-white text-neutral-900',
                        disabled && 'bg-neutral-50 text-neutral-400 cursor-not-allowed',
                        // High contrast mode
                        'forced-colors:border-[FieldBorder] forced-colors:bg-[Field]',
                        className
                    )}
                    disabled={disabled}
                    {...(describedByIds && aria.describedBy(describedByIds))}
                    {...(error && { 'aria-invalid': true })}
                    onFocus={(e) => {
                        setIsFocused(true)
                        props.onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        setIsFocused(false)
                        props.onBlur?.(e)
                    }}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p
                    id={errorId}
                    className="text-sm text-red-600 flex items-center gap-1"
                    aria-live="polite"
                    role="alert"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p
                    id={helperTextId}
                    className="text-sm text-neutral-600"
                >
                    {helperText}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'