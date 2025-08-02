"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Mobile-first positioning: top on mobile, bottom-right on desktop
      "fixed top-4 left-4 right-4 z-[100] flex max-h-screen w-auto flex-col-reverse gap-2",
      "sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:flex-col sm:max-w-[420px]",
      // Safe area support for devices with notches
      "safe-area-top safe-area-left safe-area-right sm:safe-area-bottom",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-[#EEF3FC] bg-white text-[#163461] shadow-[0_4px_6px_-1px_rgba(4,163,232,0.1)]",
        destructive: "destructive group border-[#163461] bg-[#163461] text-white shadow-[0_4px_6px_-1px_rgba(22,52,97,0.2)]",
        success: "border-[#04A3E8] bg-[#04A3E8] text-white shadow-[0_4px_6px_-1px_rgba(4,163,232,0.2)]",
        warning: "border-[#7C7D7F] bg-[#7C7D7F] text-white shadow-[0_4px_6px_-1px_rgba(124,125,127,0.2)]",
        info: "border-[#EEF3FC] bg-[#F1F5FC] text-[#163461] shadow-[0_4px_6px_-1px_rgba(4,163,232,0.05)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // BayiCare styling with proper touch targets
      "inline-flex h-10 min-w-[44px] shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium font-nunito transition-colors",
      "hover:bg-[#F1F5FC] focus:outline-none focus:ring-2 focus:ring-[#04A3E8] focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      // Variant-specific styles
      "group-[.destructive]:border-white/40 group-[.destructive]:text-white group-[.destructive]:hover:bg-white/10 group-[.destructive]:focus:ring-white",
      "group-[.success]:border-white/40 group-[.success]:text-white group-[.success]:hover:bg-white/10 group-[.success]:focus:ring-white",
      "group-[.warning]:border-white/40 group-[.warning]:text-white group-[.warning]:hover:bg-white/10 group-[.warning]:focus:ring-white",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // BayiCare styling with proper touch targets and accessibility
      "absolute right-2 top-2 rounded-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center",
      "text-[#163461]/70 opacity-0 transition-all duration-200",
      "hover:text-[#163461] hover:bg-[#F1F5FC] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#04A3E8] focus:ring-offset-2",
      "group-hover:opacity-100",
      // Variant-specific styles
      "group-[.destructive]:text-white/70 group-[.destructive]:hover:text-white group-[.destructive]:hover:bg-white/10 group-[.destructive]:focus:ring-white",
      "group-[.success]:text-white/70 group-[.success]:hover:text-white group-[.success]:hover:bg-white/10 group-[.success]:focus:ring-white",
      "group-[.warning]:text-white/70 group-[.warning]:hover:text-white group-[.warning]:hover:bg-white/10 group-[.warning]:focus:ring-white",
      className
    )}
    toast-close=""
    aria-label="Tutup notifikasi"
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold font-nunito leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 font-nunito leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
