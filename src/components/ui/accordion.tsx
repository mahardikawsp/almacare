"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-[#EEF3FC] last:border-b-0",
      // Add background and rounded corners for better visual separation
      "bg-white rounded-xl mb-2 border border-[#EEF3FC] shadow-[0_2px_4px_-1px_rgba(4,163,232,0.05)]",
      "overflow-hidden", // Ensure content doesn't overflow rounded corners
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // BayiCare styling with proper touch targets
        "flex flex-1 items-center justify-between py-4 px-4 font-medium font-nunito text-[#163461]",
        "min-h-[44px] transition-all duration-200", // Mobile touch target
        // Hover and focus states with proper ARIA attributes
        "hover:bg-[#F1F5FC] hover:text-[#04A3E8]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04A3E8] focus-visible:ring-offset-2",
        // Icon rotation animation
        "[&[data-state=open]>svg]:rotate-180",
        // Remove default underline, add custom hover effect
        "hover:no-underline",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 text-[#7C7D7F] transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm font-nunito text-[#163461] transition-all",
      // Smooth animations with proper timing
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      // Reduced motion support
      "reduce-motion:data-[state=closed]:animate-none reduce-motion:data-[state=open]:animate-none",
      className
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0 px-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
