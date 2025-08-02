'use client'

import React from 'react'
import { Button } from './Button'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<ErrorFallbackProps>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
    error?: Error
    resetError: () => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        this.setState({
            error,
            errorInfo,
        })

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return (
                <FallbackComponent
                    error={this.state.error}
                    resetError={this.resetError}
                />
            )
        }

        return this.props.children
    }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>

                <h2 className="text-xl font-semibold text-primary-900 mb-2">
                    Oops! Terjadi Kesalahan
                </h2>

                <p className="text-neutral-600 mb-6">
                    Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang menangani masalah ini.
                </p>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="text-left bg-red-50 p-4 rounded-lg mb-6 text-sm">
                        <summary className="cursor-pointer font-medium text-red-800 mb-2">
                            Detail Error (Development)
                        </summary>
                        <pre className="whitespace-pre-wrap text-red-700 overflow-auto">
                            {error.message}
                            {error.stack}
                        </pre>
                    </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={resetError} icon={<ArrowPathIcon />}>
                        Coba Lagi
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Muat Ulang Halaman
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Specific error fallbacks for different scenarios
function NetworkErrorFallback({ resetError }: ErrorFallbackProps) {
    return (
        <div className="text-center p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>

            <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Koneksi Bermasalah
            </h3>

            <p className="text-neutral-600 mb-4">
                Tidak dapat terhubung ke server. Periksa koneksi internet Anda.
            </p>

            <Button onClick={resetError} size="sm">
                Coba Lagi
            </Button>
        </div>
    )
}

function DataErrorFallback({ resetError }: ErrorFallbackProps) {
    return (
        <div className="text-center p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Data Tidak Tersedia
            </h3>

            <p className="text-neutral-600 mb-4">
                Terjadi masalah saat memuat data. Silakan coba lagi.
            </p>

            <Button onClick={resetError} size="sm">
                Muat Ulang
            </Button>
        </div>
    )
}

// Hook for handling errors in functional components
function useErrorHandler() {
    return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
        console.error('Error caught by useErrorHandler:', error, errorInfo)

        // You can integrate with error reporting service here
        // Example: Sentry.captureException(error)
    }, [])
}

// Higher-order component for wrapping components with error boundary
function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorFallback?: React.ComponentType<ErrorFallbackProps>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={errorFallback}>
            <Component {...props} />
        </ErrorBoundary>
    )

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

    return WrappedComponent
}

export {
    ErrorBoundary,
    DefaultErrorFallback,
    NetworkErrorFallback,
    DataErrorFallback,
    useErrorHandler,
    withErrorBoundary,
    type ErrorFallbackProps,
}