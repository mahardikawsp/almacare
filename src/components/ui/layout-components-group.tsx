"use client"

// Layout Components Group - Lazy loaded bundle
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet'
export { ResponsiveContainer } from './layout/responsive-container'
export { SafeAreaWrapper } from './layout/safe-area-wrapper'
export { MobileNav } from './layout/mobile-nav'

// Default export for lazy loading
export function LayoutComponentsGroup({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
}

export default LayoutComponentsGroup