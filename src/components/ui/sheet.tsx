"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-berkeley-blue/80 backdrop-blur-sm",
      // Smooth animations with reduced motion support
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "reduce-motion:data-[state=open]:animate-none reduce-motion:data-[state=closed]:animate-none",
      "duration-300 ease-out",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  cn(
    // Base styles with BayiCare theming
    "fixed z-50 gap-4 bg-background shadow-soft-lg",
    // Smooth transitions with reduced motion support
    "transition-all ease-out duration-300",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "reduce-motion:data-[state=open]:animate-none reduce-motion:data-[state=closed]:animate-none"
  ),
  {
    variants: {
      side: {
        top: cn(
          // Top sheet - mobile-optimized for notifications/alerts
          "inset-x-0 top-0 border-b border-alice-blue rounded-b-xl",
          "p-4 sm:p-6",
          // Safe area handling
          "pt-[calc(1rem+env(safe-area-inset-top))]",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
        ),
        bottom: cn(
          // Bottom sheet - primary mobile pattern for forms/actions
          "inset-x-0 bottom-0 border-t border-alice-blue rounded-t-xl",
          "p-4 sm:p-6",
          // Safe area handling for devices with home indicators
          "pb-[calc(1rem+env(safe-area-inset-bottom))]",
          // Mobile-first sizing
          "max-h-[85vh] overflow-y-auto",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        ),
        left: cn(
          // Left sheet - navigation/menu
          "inset-y-0 left-0 h-full border-r border-alice-blue",
          "w-[85vw] max-w-sm p-4 sm:p-6",
          // Safe area handling
          "pl-[calc(1rem+env(safe-area-inset-left))]",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
        ),
        right: cn(
          // Right sheet - secondary actions/details
          "inset-y-0 right-0 h-full border-l border-alice-blue",
          "w-[85vw] max-w-sm p-4 sm:p-6",
          // Safe area handling
          "pr-[calc(1rem+env(safe-area-inset-right))]",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        ),
      },
    },
    defaultVariants: {
      side: "bottom", // Mobile-first: bottom sheet is most common
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
  VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "bottom", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {/* Mobile-friendly drag handle for bottom sheets */}
      {side === "bottom" && (
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-alice-blue" />
      )}

      {children}

      <SheetPrimitive.Close
        className={cn(
          // Position based on sheet side
          side === "top" ? "absolute right-3 top-3" : "absolute right-3 top-3",
          side === "bottom" ? "sm:right-4 sm:top-4" : "",
          // Touch-friendly close button
          "flex h-10 w-10 items-center justify-center",
          "rounded-lg bg-alice-blue/50 text-berkeley-blue",
          "opacity-70 transition-all duration-200",
          "hover:opacity-100 hover:bg-alice-blue",
          // Accessibility
          "focus:outline-none focus:ring-2 focus:ring-picton-blue focus:ring-offset-2",
          "disabled:pointer-events-none",
          // High contrast support
          "high-contrast:border high-contrast:border-current"
        )}
        aria-label="Tutup sheet"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Tutup</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Mobile-first header layout
      "flex flex-col space-y-2 text-center sm:text-left",
      // Proper spacing for mobile with border
      "pb-4 mb-4 border-b border-alice-blue",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Mobile-first footer layout with proper spacing
      "flex flex-col gap-3 pt-4 mt-4 border-t border-alice-blue",
      "sm:flex-row sm:justify-end sm:gap-2",
      // Touch-friendly button spacing on mobile
      "[&>button]:min-h-touch [&>button]:w-full sm:[&>button]:w-auto",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      // BayiCare typography with proper mobile sizing
      "text-lg sm:text-xl font-semibold leading-tight tracking-tight",
      "text-berkeley-blue font-display",
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      // Readable description text with proper contrast
      "text-sm sm:text-base text-gray leading-relaxed",
      className
    )}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
