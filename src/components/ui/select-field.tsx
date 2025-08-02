'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select"

const selectFieldVariants = cva(
    "space-y-2",
    {
        variants: {
            fullWidth: {
                true: "w-full",
                false: "",
            },
        },
        defaultVariants: {
            fullWidth: true,
        },
    }
)

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectFieldProps
    extends Omit<React.ComponentProps<typeof SelectTrigger>, "children">,
    VariantProps<typeof selectFieldVariants> {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    placeholder?: string
    onValueChange?: (value: string) => void
    value?: string
    defaultValue?: string
    required?: boolean
}

const SelectField = React.forwardRef<
    React.ElementRef<typeof SelectTrigger>,
    SelectFieldProps
>(({
    label,
    error,
    helperText,
    options,
    placeholder,
    fullWidth,
    className,
    id,
    required,
    disabled,
    onValueChange,
    value,
    defaultValue,
    ...props
}, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId
    const errorId = error ? `${selectId}-error` : undefined
    const helperTextId = helperText ? `${selectId}-helper` : undefined

    const describedByIds = [errorId, helperTextId].filter(Boolean).join(' ')

    return (
        <div className={cn(selectFieldVariants({ fullWidth }), className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn(
                        'block text-sm font-medium font-sans transition-colors',
                        error ? 'text-red-600' : 'text-berkeley-blue',
                        disabled && 'text-gray'
                    )}
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1" aria-label="required">*</span>
                    )}
                </label>
            )}

            <Select
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    ref={ref}
                    id={selectId}
                    className={cn(
                        error && "border-red-500 focus:ring-red-500 focus:border-red-500"
                    )}
                    aria-describedby={describedByIds || undefined}
                    aria-invalid={error ? true : undefined}
                    {...props}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <p
                    id={errorId}
                    className="text-sm text-red-600 font-medium flex items-center gap-1"
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
                    className="text-sm text-gray"
                >
                    {helperText}
                </p>
            )}
        </div>
    )
})

SelectField.displayName = 'SelectField'

export { SelectField, selectFieldVariants }