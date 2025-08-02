'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Textarea, TextareaProps } from "./textarea"

const textareaFieldVariants = cva(
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

export interface TextareaFieldProps
    extends TextareaProps,
    VariantProps<typeof textareaFieldVariants> {
    label?: string
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({
        label,
        error,
        helperText,
        fullWidth,
        className,
        id,
        required,
        disabled,
        ...props
    }, ref) => {
        const generatedId = React.useId()
        const textareaId = id || generatedId

        return (
            <div className={cn(textareaFieldVariants({ fullWidth }), className)}>
                {label && (
                    <label
                        htmlFor={textareaId}
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

                <Textarea
                    ref={ref}
                    id={textareaId}
                    error={error}
                    helperText={helperText}
                    disabled={disabled}
                    {...props}
                />
            </div>
        )
    }
)

TextareaField.displayName = 'TextareaField'

export { TextareaField, textareaFieldVariants }