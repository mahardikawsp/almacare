import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
    "rounded-xl border bg-card text-card-foreground font-sans transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-alice-blue shadow-soft hover:shadow-soft-lg",
                elevated: "border-alice-blue shadow-soft-lg hover:shadow-xl hover:-translate-y-1",
                interactive: "border-alice-blue shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer active:scale-[0.98] touch:active:scale-[0.98]",
                outline: "border-2 border-picton-blue bg-white shadow-none hover:bg-alice-blue/50",
            },
            padding: {
                default: "",
                none: "p-0",
                sm: "p-3",
                md: "p-4",
                lg: "p-6",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "default",
        },
    }
)

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, asChild = false, ...props }, ref) => {
        const Comp = asChild ? "div" : "div"
        return (
            <Comp
                ref={ref}
                className={cn(cardVariants({ variant, padding, className }))}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-2 p-4 sm:p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "text-lg sm:text-xl lg:text-2xl font-semibold leading-tight tracking-tight text-berkeley-blue font-sans",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm sm:text-base text-gray leading-relaxed font-sans", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center gap-2 p-4 sm:p-6 pt-0 flex-wrap", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
