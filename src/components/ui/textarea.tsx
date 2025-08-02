import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-xl border bg-white px-4 py-3 font-sans transition-all duration-200 resize-y placeholder:text-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-picton-blue focus-visible:ring-offset-2 focus-visible:border-picton-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-alice-blue disabled:resize-none",
  {
    variants: {
      variant: {
        default: "border-alice-blue text-berkeley-blue",
        error: "border-red-500 text-berkeley-blue focus-visible:ring-red-500 focus-visible:border-red-500",
        success: "border-green-500 text-berkeley-blue focus-visible:ring-green-500 focus-visible:border-green-500",
      },
      size: {
        default: "min-h-[80px] text-base", // 16px font size to prevent zoom on mobile
        sm: "min-h-[60px] text-sm px-3 py-2",
        lg: "min-h-[120px] text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
  VariantProps<typeof textareaVariants> {
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, helperText, disabled, ...props }, ref) => {
    const textareaId = React.useId()
    const hasError = Boolean(error)
    const effectiveVariant = hasError ? "error" : variant

    return (
      <div className="w-full">
        <textarea
          id={textareaId}
          className={cn(textareaVariants({ variant: effectiveVariant, size, className }))}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-red-500 font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="mt-2 text-sm text-gray"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
