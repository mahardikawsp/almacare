import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Alert, AlertTitle, AlertDescription } from '../alert'
import { Toast, ToastTitle, ToastDescription, ToastClose, ToastProvider, ToastViewport } from '../toast'
import { useToast, toast, toastSuccess, toastError, toastWarning, toastInfo } from '@/hooks/use-toast'
import { Toaster } from '../toaster'

expect.extend(toHaveNoViolations)

// Mock component to test useToast hook
function TestToastComponent() {
    const { toast: showToast } = useToast()

    return (
        <div>
            <button onClick={() => showToast({ title: "Test Toast", description: "Test description" })}>
                Show Toast
            </button>
            <button onClick={() => toastSuccess("Success", "Success message")}>
                Show Success
            </button>
            <button onClick={() => toastError("Error", "Error message")}>
                Show Error
            </button>
            <button onClick={() => toastWarning("Warning", "Warning message")}>
                Show Warning
            </button>
            <button onClick={() => toastInfo("Info", "Info message")}>
                Show Info
            </button>
            <Toaster />
        </div>
    )
}

describe('Alert Component', () => {
    it('renders with default variant', () => {
        render(
            <Alert>
                <AlertTitle>Test Alert</AlertTitle>
                <AlertDescription>This is a test alert</AlertDescription>
            </Alert>
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('Test Alert')).toBeInTheDocument()
        expect(screen.getByText('This is a test alert')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
        const { rerender } = render(
            <Alert variant="success">
                <AlertTitle>Success Alert</AlertTitle>
            </Alert>
        )

        expect(screen.getByRole('alert')).toHaveClass('border-[#04A3E8]/20')

        rerender(
            <Alert variant="destructive">
                <AlertTitle>Error Alert</AlertTitle>
            </Alert>
        )

        expect(screen.getByRole('alert')).toHaveClass('border-[#163461]/20')
    })

    it('has proper accessibility attributes', async () => {
        const { container } = render(
            <Alert>
                <AlertTitle>Accessible Alert</AlertTitle>
                <AlertDescription>This alert is accessible</AlertDescription>
            </Alert>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('uses BayiCare styling and Nunito font', () => {
        render(
            <Alert>
                <AlertTitle>Styled Alert</AlertTitle>
                <AlertDescription>With BayiCare styling</AlertDescription>
            </Alert>
        )

        const alert = screen.getByRole('alert')
        const title = screen.getByText('Styled Alert')
        const description = screen.getByText('With BayiCare styling')

        expect(alert).toHaveClass('rounded-xl', 'font-nunito')
        expect(title).toHaveClass('font-nunito', 'font-semibold')
        expect(description).toHaveClass('font-nunito')
    })
})

describe('Toast Component', () => {
    it('renders toast with proper structure', () => {
        render(
            <ToastProvider>
                <Toast open={true}>
                    <ToastTitle>Test Toast</ToastTitle>
                    <ToastDescription>Toast description</ToastDescription>
                    <ToastClose />
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        expect(screen.getByText('Test Toast')).toBeInTheDocument()
        expect(screen.getByText('Toast description')).toBeInTheDocument()
        expect(screen.getByLabelText('Tutup notifikasi')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
        const { rerender } = render(
            <ToastProvider>
                <Toast variant="success" open={true}>
                    <ToastTitle>Success Toast</ToastTitle>
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        let toast = screen.getByText('Success Toast').closest('[role]')
        expect(toast).toHaveClass('border-[#04A3E8]')

        rerender(
            <ToastProvider>
                <Toast variant="destructive" open={true}>
                    <ToastTitle>Error Toast</ToastTitle>
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        toast = screen.getByText('Error Toast').closest('[role]')
        expect(toast).toHaveClass('border-[#163461]')
    })

    it('has proper accessibility attributes', async () => {
        const { container } = render(
            <ToastProvider>
                <Toast open={true} aria-live="polite" aria-label="Test notification">
                    <ToastTitle>Accessible Toast</ToastTitle>
                    <ToastDescription>This toast is accessible</ToastDescription>
                    <ToastClose />
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('has proper touch targets (minimum 44px)', () => {
        render(
            <ToastProvider>
                <Toast open={true}>
                    <ToastTitle>Touch Target Test</ToastTitle>
                    <ToastClose />
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        const closeButton = screen.getByLabelText('Tutup notifikasi')
        expect(closeButton).toHaveClass('min-w-[44px]', 'min-h-[44px]')
    })

    it('uses BayiCare styling and Nunito font', () => {
        render(
            <ToastProvider>
                <Toast open={true}>
                    <ToastTitle>Styled Toast</ToastTitle>
                    <ToastDescription>With BayiCare styling</ToastDescription>
                </Toast>
                <ToastViewport />
            </ToastProvider>
        )

        const title = screen.getByText('Styled Toast')
        const description = screen.getByText('With BayiCare styling')

        expect(title).toHaveClass('font-nunito', 'font-semibold')
        expect(description).toHaveClass('font-nunito')
    })
})

describe('Toast Hook and Helper Functions', () => {
    it('shows toast with useToast hook', async () => {
        render(<TestToastComponent />)

        fireEvent.click(screen.getByText('Show Toast'))

        await waitFor(() => {
            expect(screen.getByText('Test Toast')).toBeInTheDocument()
            expect(screen.getByText('Test description')).toBeInTheDocument()
        })
    })

    it('shows success toast with proper styling', async () => {
        render(<TestToastComponent />)

        fireEvent.click(screen.getByText('Show Success'))

        await waitFor(() => {
            expect(screen.getByText('Success')).toBeInTheDocument()
            expect(screen.getByText('Success message')).toBeInTheDocument()
        })
    })

    it('shows error toast with assertive aria-live', async () => {
        render(<TestToastComponent />)

        fireEvent.click(screen.getByText('Show Error'))

        await waitFor(() => {
            const toast = screen.getByText('Error').closest('[role="status"]')
            expect(toast).toHaveAttribute('aria-live', 'assertive')
        })
    })

    it('shows warning and info toasts', async () => {
        render(<TestToastComponent />)

        fireEvent.click(screen.getByText('Show Warning'))
        await waitFor(() => {
            expect(screen.getByText('Warning')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Show Info'))
        await waitFor(() => {
            expect(screen.getByText('Info')).toBeInTheDocument()
        })
    })
})

describe('Mobile-Friendly Positioning', () => {
    it('has mobile-first responsive positioning', () => {
        render(
            <ToastProvider>
                <ToastViewport />
            </ToastProvider>
        )

        const viewport = document.querySelector('[data-radix-toast-viewport]')
        expect(viewport).toHaveClass(
            'top-4', 'left-4', 'right-4', // Mobile positioning
            'sm:top-auto', 'sm:bottom-4', 'sm:left-auto', 'sm:right-4' // Desktop positioning
        )
    })

    it('includes safe area support', () => {
        render(
            <ToastProvider>
                <ToastViewport />
            </ToastProvider>
        )

        const viewport = document.querySelector('[data-radix-toast-viewport]')
        expect(viewport).toHaveClass(
            'safe-area-top', 'safe-area-left', 'safe-area-right', 'sm:safe-area-bottom'
        )
    })
})