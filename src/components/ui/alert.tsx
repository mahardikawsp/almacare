import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 font-nunito [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-[#F1F5FC] border-[#EEF3FC] text-[#163461] shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]",
        destructive: "border-[#163461]/20 bg-[#163461]/5 text-[#163461] [&>svg]:text-[#163461]",
        success: "border-[#04A3E8]/20 bg-[#04A3E8]/5 text-[#163461] [&>svg]:text-[#04A3E8]",
        warning: "border-[#7C7D7F]/20 bg-[#7C7D7F]/5 text-[#163461] [&>svg]:text-[#7C7D7F]",
        info: "border-[#04A3E8]/20 bg-[#04A3E8]/5 text-[#163461] [&>svg]:text-[#04A3E8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold font-nunito leading-tight tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-nunito [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
