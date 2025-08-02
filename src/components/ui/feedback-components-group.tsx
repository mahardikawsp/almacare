"use client"

// Feedback Components Group - Lazy loaded bundle
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast'
export { Toaster } from './toaster'
export { Alert, AlertDescription, AlertTitle } from './alert'
export { Progress } from './progress'
export { Skeleton } from './skeleton'

// Default export for lazy loading
export function FeedbackComponentsGroup({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>
}

export default FeedbackComponentsGroup