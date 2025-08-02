'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

const toastVariants = cva(
    'group pointer-events-auto relative flex w-full items-start justify-between space-x-3 sm:space-x-4 overflow-hidden rounded-xl sm:rounded-2xl border p-3 sm:p-4 pr-10 sm:pr-12 shadow-soft-lg transition-all transform-gpu animate-slide-down-in backdrop-blur-sm min-h-touch',
    {
        variants: {
            variant: {
                default: 'border-primary-200 bg-background-card/95 text-primary-900',
                success: 'border-primary-300 bg-primary-50/95 text-primary-800 shadow-[0_4px_20px_rgba(4,163,232,0.15)]',
                error: 'border-berkeley-blue/30 bg-berkeley-blue/5 text-berkeley-blue shadow-[0_4px_20px_rgba(22,52,97,0.15)]',
                warning: 'border-neutral-300 bg-neutral-50/95 text-neutral-800 shadow-[0_4px_20px_rgba(124,125,127,0.15)]',
                info: 'border-primary-200 bg-alice-blue/95 text-berkeley-blue shadow-[0_4px_20px_rgba(4,163,232,0.1)]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

const Toast = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(toastVariants({ variant }), className)}
            {...props}
        />
    )
})
Toast.displayName = 'Toast'

const ToastAction = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            'inline-flex min-h-touch min-w-touch h-8 sm:h-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-primary-300 bg-primary-500 text-white px-3 sm:px-4 text-xs sm:text-sm font-semibold ring-offset-white transition-all duration-200 hover:bg-primary-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch:bg-primary-600',
            className
        )}
        {...props}
    />
))
ToastAction.displayName = 'ToastAction'

const ToastClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            'absolute right-2 top-2 rounded-lg p-1.5 sm:p-1 min-h-touch min-w-touch sm:min-h-0 sm:min-w-0 text-neutral-500 opacity-70 sm:opacity-0 transition-all duration-200 hover:text-berkeley-blue hover:bg-primary-50 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-400 group-hover:opacity-100 active:scale-90 touch:opacity-100',
            className
        )}
        {...props}
    >
        <XMarkIcon className="h-4 w-4" />
    </button>
))
ToastClose.displayName = 'ToastClose'

const ToastTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('text-sm sm:text-base font-bold leading-tight', className)}
        {...props}
    />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('text-xs sm:text-sm opacity-80 leading-relaxed mt-1', className)}
        {...props}
    />
))
ToastDescription.displayName = 'ToastDescription'

// Toast icon component
function ToastIcon({ variant }: { variant: 'success' | 'error' | 'warning' | 'info' }) {
    const iconConfig = {
        success: {
            Icon: CheckCircleIcon,
            className: 'h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-primary-600'
        },
        error: {
            Icon: XCircleIcon,
            className: 'h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-berkeley-blue'
        },
        warning: {
            Icon: ExclamationTriangleIcon,
            className: 'h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-neutral-600'
        },
        info: {
            Icon: InformationCircleIcon,
            className: 'h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-primary-500'
        },
    }

    const { Icon, className } = iconConfig[variant]

    return <Icon className={className} />
}

// Pre-built toast components
interface ToastProps {
    title: string
    description?: string
    action?: React.ReactNode
    onClose?: () => void
}

function SuccessToast({ title, description, action, onClose }: ToastProps) {
    return (
        <Toast variant="success">
            <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                    <ToastIcon variant="success" />
                </div>
                <div className="flex-1 min-w-0">
                    <ToastTitle>{title}</ToastTitle>
                    {description && <ToastDescription>{description}</ToastDescription>}
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
            {onClose && <ToastClose onClick={onClose} />}
        </Toast>
    )
}

function ErrorToast({ title, description, action, onClose }: ToastProps) {
    return (
        <Toast variant="error">
            <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                    <ToastIcon variant="error" />
                </div>
                <div className="flex-1 min-w-0">
                    <ToastTitle>{title}</ToastTitle>
                    {description && <ToastDescription>{description}</ToastDescription>}
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
            {onClose && <ToastClose onClick={onClose} />}
        </Toast>
    )
}

function WarningToast({ title, description, action, onClose }: ToastProps) {
    return (
        <Toast variant="warning">
            <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                    <ToastIcon variant="warning" />
                </div>
                <div className="flex-1 min-w-0">
                    <ToastTitle>{title}</ToastTitle>
                    {description && <ToastDescription>{description}</ToastDescription>}
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
            {onClose && <ToastClose onClick={onClose} />}
        </Toast>
    )
}

function InfoToast({ title, description, action, onClose }: ToastProps) {
    return (
        <Toast variant="info">
            <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                    <ToastIcon variant="info" />
                </div>
                <div className="flex-1 min-w-0">
                    <ToastTitle>{title}</ToastTitle>
                    {description && <ToastDescription>{description}</ToastDescription>}
                    {action && <div className="mt-3">{action}</div>}
                </div>
            </div>
            {onClose && <ToastClose onClick={onClose} />}
        </Toast>
    )
}

export {
    Toast,
    ToastAction,
    ToastClose,
    ToastTitle,
    ToastDescription,
    ToastIcon,
    SuccessToast,
    ErrorToast,
    WarningToast,
    InfoToast,
}