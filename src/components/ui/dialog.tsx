"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
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
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Mobile-first responsive positioning
        "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]",
        // Mobile: full width with safe margins, Desktop: max width
        "mx-4 max-w-[calc(100vw-2rem)] sm:max-w-lg",
        // BayiCare styling with proper spacing
        "gap-4 border border-alice-blue bg-background p-4 sm:p-6",
        "rounded-xl shadow-soft-lg",
        // Safe area handling for devices with notches
        "max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)]",
        "overflow-y-auto",
        // Smooth animations with reduced motion support
        "duration-300 ease-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        // Reduced motion support
        "reduce-motion:data-[state=open]:animate-none reduce-motion:data-[state=closed]:animate-none",
        // Focus management
        "focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          // Touch-friendly close button
          "absolute right-3 top-3 sm:right-4 sm:top-4",
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
        aria-label="Tutup dialog"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Tutup</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Mobile-first header layout
      "flex flex-col space-y-2 text-center sm:text-left",
      // Proper spacing for mobile
      "pb-4 border-b border-alice-blue",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Mobile-first footer layout with proper spacing
      "flex flex-col gap-3 pt-4 border-t border-alice-blue",
      "sm:flex-row sm:justify-end sm:gap-2",
      // Touch-friendly button spacing on mobile
      "[&>button]:min-h-touch [&>button]:w-full sm:[&>button]:w-auto",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
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
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Readable description text with proper contrast
      "text-sm sm:text-base text-gray leading-relaxed",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
