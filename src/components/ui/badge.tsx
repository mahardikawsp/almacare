import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium font-nunito transition-colors focus:outline-none focus:ring-2 focus:ring-[#04A3E8] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#04A3E8]/20 bg-[#04A3E8]/10 text-[#04A3E8] hover:bg-[#04A3E8]/20",
        secondary:
          "border-[#EEF3FC] bg-[#F1F5FC] text-[#163461] hover:bg-[#EEF3FC]",
        destructive:
          "border-[#163461]/20 bg-[#163461]/10 text-[#163461] hover:bg-[#163461]/20",
        success:
          "border-[#04A3E8]/20 bg-[#04A3E8]/10 text-[#04A3E8] hover:bg-[#04A3E8]/20",
        warning:
          "border-[#7C7D7F]/20 bg-[#7C7D7F]/10 text-[#7C7D7F] hover:bg-[#7C7D7F]/20",
        outline:
          "border-[#EEF3FC] text-[#163461] hover:bg-[#F1F5FC]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
