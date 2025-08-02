import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-xl border bg-white px-4 py-3 font-sans transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-picton-blue focus-visible:ring-offset-2 focus-visible:border-picton-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-alice-blue",
  {
    variants: {
      variant: {
        default: "border-alice-blue text-berkeley-blue",
        error: "border-red-500 text-berkeley-blue focus-visible:ring-red-500 focus-visible:border-red-500",
        success: "border-green-500 text-berkeley-blue focus-visible:ring-green-500 focus-visible:border-green-500",
      },
      size: {
        default: "h-12 text-base", // 16px font size to prevent zoom on mobile
        sm: "h-10 text-sm px-3 py-2",
        lg: "h-14 text-lg px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
  VariantProps<typeof inputVariants> {
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    variant,
    size,
    error,
    helperText,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)
    const inputId = React.useId()

    React.useEffect(() => {
      if (type === "password" && showPasswordToggle) {
        setInputType(showPassword ? "text" : "password")
      } else {
        setInputType(type)
      }
    }, [type, showPassword, showPasswordToggle])

    const hasError = Boolean(error)
    const effectiveVariant = hasError ? "error" : variant

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({ variant: effectiveVariant, size, className }),
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || hasError) && "pr-10"
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={16} />
            </div>
          )}

          {!hasError && showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-berkeley-blue transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {!hasError && !showPasswordToggle && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-500 font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
