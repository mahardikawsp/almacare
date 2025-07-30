'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { aria } from '@/lib/accessibility'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    placeholder?: string
    fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    helperText,
    options,
    placeholder,
    fullWidth = false,
    className,
    id,
    required,
    disabled,
    ...props
}, ref) => {
    const selectId = id || aria.generateId('select')
    const errorId = error ? aria.generateId('error') : undefined
    const helperTextId = helperText ? aria.generateId('helper') : undefined

    const describedByIds = [errorId, helperTextId].filter(Boolean).join(' ')

    return (
        <div className={cn('space-y-2', fullWidth && 'w-full')}>
            {label && (
                <label
                    htmlFor={selectId}
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
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        // Base styles
                        'w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200',
                        'appearance-none cursor-pointer',
                        // Focus styles
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        // Mobile optimization
                        'text-base sm:text-sm', // Prevent zoom on iOS
                        'min-h-[44px]', // Touch-friendly height
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
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDownIcon className="w-5 h-5 text-neutral-400" />
                </div>
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

Select.displayName = 'Select'