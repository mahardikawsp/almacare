'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface FormFieldProps {
    children: React.ReactNode
    label?: string
    error?: string
    success?: string
    hint?: string
    helpText?: string
    required?: boolean
    className?: string
}

export function FormField({
    children,
    label,
    error,
    success,
    hint,
    helpText,
    required,
    className
}: FormFieldProps) {
    const fieldId = React.useId()

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label
                    htmlFor={fieldId}
                    className="block text-sm font-medium text-berkeley-blue mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {React.cloneElement(children as React.ReactElement, {
                    id: fieldId,
                    className: cn(
                        'form-input',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                        success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
                        (children as React.ReactElement).props.className
                    ),
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-describedby': error ? `${fieldId}-error` : success ? `${fieldId}-success` : hint ? `${fieldId}-hint` : undefined,
                })}

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                )}

                {success && !error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                )}
            </div>

            {error && (
                <p id={`${fieldId}-error`} className="text-sm text-red-600 flex items-center space-x-1">
                    <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </p>
            )}

            {success && !error && (
                <p id={`${fieldId}-success`} className="text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                </p>
            )}

            {(hint || helpText) && !error && !success && (
                <p id={`${fieldId}-hint`} className="text-xs text-neutral-600 mt-1">
                    {hint || helpText}
                </p>
            )}
        </div>
    )
}

// Enhanced Input component with validation states
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    success?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, success, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'form-input',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                    success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
                    className
                )}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

// Enhanced Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean
    success?: boolean
    placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, success, placeholder, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    'form-input appearance-none bg-white',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                    success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {children}
            </select>
        )
    }
)
Select.displayName = 'Select'

// Enhanced Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean
    success?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, success, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    'form-input min-h-[80px] resize-y',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                    success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
                    className
                )}
                {...props}
            />
        )
    }
)
Textarea.displayName = 'Textarea'

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
    initialValues: T,
    validationRules: Record<keyof T, (value: any) => string | null>
) {
    const [values, setValues] = React.useState<T>(initialValues)
    const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({})
    const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({})

    const validateField = (name: keyof T, value: any) => {
        const rule = validationRules[name]
        if (rule) {
            const error = rule(value)
            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
            return error === null
        }
        return true
    }

    const validateAll = () => {
        const newErrors: Partial<Record<keyof T, string>> = {}
        let isValid = true

        Object.keys(validationRules).forEach(key => {
            const fieldName = key as keyof T
            const error = validationRules[fieldName](values[fieldName])
            if (error) {
                newErrors[fieldName] = error
                isValid = false
            }
        })

        setErrors(newErrors)
        return isValid
    }

    const handleChange = (name: keyof T, value: any) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }))

        if (touched[name]) {
            validateField(name, value)
        }
    }

    const handleBlur = (name: keyof T) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }))
        validateField(name, values[name])
    }

    const reset = () => {
        setValues(initialValues)
        setErrors({})
        setTouched({})
    }

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        isValid: Object.keys(errors).length === 0
    }
}