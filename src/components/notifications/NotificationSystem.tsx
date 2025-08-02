'use client'

import React from 'react'
import { ToastContainer } from './ToastContainer'

export function NotificationSystem() {
    return <ToastContainer />
}

// Re-export the enhanced useToast hook for backward compatibility
export { useToast, toast as notify } from '@/hooks/useToast'