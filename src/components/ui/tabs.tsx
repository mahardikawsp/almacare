"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // BayiCare styling with mobile-first approach
      "inline-flex h-12 sm:h-10 items-center justify-center rounded-xl bg-[#F1F5FC] p-1 text-[#7C7D7F] font-nunito",
      "border border-[#EEF3FC] shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]",
      // Mobile responsive - full width on small screens
      "w-full sm:w-auto",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // BayiCare styling with proper touch targets
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 sm:py-1.5",
      "text-sm font-medium font-nunito transition-all duration-200",
      "min-h-[44px] sm:min-h-[36px] flex-1 sm:flex-initial", // Mobile touch targets
      // Focus-visible and interaction states
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04A3E8] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      // Active state with BayiCare colors
      "data-[state=active]:bg-white data-[state=active]:text-[#163461] data-[state=active]:shadow-[0_2px_4px_-1px_rgba(4,163,232,0.1)]",
      "data-[state=active]:border data-[state=active]:border-[#04A3E8]/20",
      // Hover state
      "hover:bg-white/50 hover:text-[#163461]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 font-nunito text-[#163461]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04A3E8] focus-visible:ring-offset-2",
      // Animation support with reduced motion
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
      "reduce-motion:data-[state=active]:animate-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
