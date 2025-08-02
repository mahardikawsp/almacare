import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "./input"
import { Label } from "./label"

export interface FormFieldProps extends Omit<InputProps, "id"> {
    label?: string
    labelProps?: React.ComponentPropsWithoutRef<typeof Label>
    containerClassName?: string
    id?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({
        label,
        labelProps,
        containerClassName,
        className,
        error,
        required,
        id: providedId,
        ...inputProps
    }, ref) => {
        const generatedId = React.useId()
        const id = providedId || generatedId

        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <Label
                        htmlFor={id}
                        {...labelProps}
                    >
                        {label}
                    </Label>
                )}
                <Input
                    id={id}
                    ref={ref}
                    error={error}
                    className={className}
                    required={required}
                    {...inputProps}
                />
            </div>
        )
    }
)
FormField.displayName = "FormField"

export { FormField }