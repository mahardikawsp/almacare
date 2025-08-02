'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChildForm } from '@/components/children/ChildForm'
import { Button } from '@/components/ui/button'
import { useChildStore } from '@/stores/childStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Child } from '@/types'

interface ChildWithCounts extends Child {
    growthRecordsCount: number
    immunizationRecordsCount: number
    mpasiFavoritesCount?: number
}

function ChildrenContent() {
    const { } = useSession()
    const { children, setChildren, removeChild } = useChildStore()
    const { addToastNotification } = useNotificationStore()

    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingChild, setEditingChild] = useState<Child | null>(null)
    const [deletingChild, setDeletingChild] = useState<Child | null>(null)
    const [childrenWithCounts, setChildrenWithCounts] = useState<ChildWithCounts[]>([])

    // Fetch children data
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await fetch('/api/children')
                if (response.ok) {
                    const data = await response.json()
                    setChildrenWithCounts(data.children)
                    setChildren(data.children)
                }
            } catch (error) {
                console.error('Error fetching children:', error)
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Error',
                    message: 'Gagal memuat data anak',
                    type: 'error',
                    duration: 5000,
                    autoHide: true
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchChildren()
    }, [setChildren, addToastNotification])

    const formatAge = (birthDate: Date) => {
        const now = new Date()
        const birth = new Date(birthDate)
        const diffTime = Math.abs(now.getTime() - birth.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 30) {
            return `${diffDays} hari`
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30)
            return `${months} bulan`
        } else {
            const years = Math.floor(diffDays / 365)
            const remainingMonths = Math.floor((diffDays % 365) / 30)
            return remainingMonths > 0 ? `${years} tahun ${remainingMonths} bulan` : `${years} tahun`
        }
    }

    const getGenderIcon = (gender: 'MALE' | 'FEMALE') => {
        if (gender === 'MALE') {
            return (
                <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )
        } else {
            return (
                <div className="w-12 h-12 bg-gradient-to-br from-gray to-berkeley-blue rounded-2xl flex items-center justify-center shadow-soft">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )
        }
    }

    const handleDeleteChild = async (child: Child) => {
        try {
            const response = await fetch(`/api/children/${child.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                const data = await response.json()
                removeChild(child.id)
                setChildrenWithCounts(prev => prev.filter(c => c.id !== child.id))
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Berhasil',
                    message: data.message,
                    type: 'success',
                    duration: 5000,
                    autoHide: true
                })
            } else {
                const data = await response.json()
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Error',
                    message: data.error || 'Gagal menghapus profil anak',
                    type: 'error',
                    duration: 5000,
                    autoHide: true
                })
            }
        } catch (error) {
            console.error('Error deleting child:', error)
            addToastNotification({
                id: Date.now().toString(),
                title: 'Error',
                message: 'Terjadi kesalahan jaringan',
                type: 'error',
                duration: 5000,
                autoHide: true
            })
        } finally {
            setDeletingChild(null)
        }
    }

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-64">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600">Memuat data anak...</span>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        Kelola Profil Anak
                    </h1>
                    <p className="text-neutral-600 font-medium">
                        Tambah, edit, atau hapus profil anak Anda. Maksimal 5 anak per akun.
                    </p>
                </div>

                {/* Add Child Button */}
                {!showAddForm && !editingChild && children.length < 5 && (
                    <div className="mb-6">
                        <Button
                            onClick={() => setShowAddForm(true)}
                            variant="default"
                            size="lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Anak Baru
                        </Button>
                    </div>
                )}

                {/* Add Child Form */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 mb-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            Tambah Anak Baru
                        </h2>
                        <ChildForm
                            mode="create"
                            onSuccess={() => {
                                setShowAddForm(false)
                                // Refresh children list
                                window.location.reload()
                            }}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
                )}

                {/* Edit Child Form */}
                {editingChild && (
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 mb-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            Edit Profil {editingChild.name}
                        </h2>
                        <ChildForm
                            child={editingChild}
                            mode="edit"
                            onSuccess={() => {
                                setEditingChild(null)
                                // Refresh children list
                                window.location.reload()
                            }}
                            onCancel={() => setEditingChild(null)}
                        />
                    </div>
                )}

                {/* Children List */}
                {childrenWithCounts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">
                            Belum ada anak terdaftar
                        </h3>
                        <p className="text-neutral-600 mb-6 font-medium">
                            Tambahkan profil anak Anda untuk mulai memantau tumbuh kembang mereka.
                        </p>
                        <Button
                            onClick={() => setShowAddForm(true)}
                            variant="default"
                        >
                            Tambah Anak Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {childrenWithCounts.map((child) => (
                            <div
                                key={child.id}
                                className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 hover:shadow-soft-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    {getGenderIcon(child.gender)}

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-neutral-900">
                                                    {child.name}
                                                </h3>
                                                <p className="text-sm text-neutral-600 font-medium">
                                                    {formatAge(child.birthDate)} • {child.relationship}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingChild(child)}
                                                    className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                                    title="Edit profil"
                                                    type="button"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeletingChild(child)}
                                                    className="p-2 text-neutral-400 hover:text-error hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Hapus profil"
                                                    type="button"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                            <div className="text-center p-3 bg-alice-blue rounded-xl">
                                                <p className="text-2xl font-bold text-picton-blue">
                                                    {child.growthRecordsCount}
                                                </p>
                                                <p className="text-xs text-berkeley-blue font-medium">Catatan Pertumbuhan</p>
                                            </div>
                                            <div className="text-center p-3 bg-alice-blue rounded-xl">
                                                <p className="text-2xl font-bold text-picton-blue">
                                                    {child.immunizationRecordsCount}
                                                </p>
                                                <p className="text-xs text-berkeley-blue font-medium">Imunisasi</p>
                                            </div>
                                            <div className="text-center p-3 bg-alice-blue rounded-xl">
                                                <p className="text-2xl font-bold text-picton-blue">
                                                    {child.mpasiFavoritesCount || 0}
                                                </p>
                                                <p className="text-xs text-berkeley-blue font-medium">Resep Favorit</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Limit Notice */}
                {children.length >= 5 && (
                    <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-warning font-medium">
                                Anda telah mencapai batas maksimal 5 anak per akun.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deletingChild && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-soft-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900">
                                Hapus Profil Anak
                            </h3>
                        </div>

                        <p className="text-neutral-600 mb-6 font-medium">
                            Apakah Anda yakin ingin menghapus profil <strong>{deletingChild.name}</strong>?
                            Semua data pertumbuhan, imunisasi, dan favorit MPASI akan ikut terhapus dan tidak dapat dikembalikan.
                        </p>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleDeleteChild(deletingChild)}
                                variant="destructive"
                                className="w-full"
                            >
                                Ya, Hapus
                            </Button>
                            <Button
                                onClick={() => setDeletingChild(null)}
                                variant="outline"
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default function ChildrenPage() {
    return (
        <AuthGuard>
            <ChildrenContent />
        </AuthGuard>
    )
}