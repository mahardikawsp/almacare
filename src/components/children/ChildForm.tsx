'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChildStore } from '@/stores/childStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Child, Gender } from '@/types'

interface ChildFormProps {
    child?: Child
    mode: 'create' | 'edit'
    onSuccess?: () => void
    onCancel?: () => void
}

interface FormData {
    name: string
    gender: Gender | ''
    birthDate: string
    relationship: string
}

interface FormErrors {
    name?: string
    gender?: string
    birthDate?: string
    relationship?: string
    general?: string
}

export function ChildForm({ child, mode, onSuccess, onCancel }: ChildFormProps) {
    const router = useRouter()
    const { addChild, updateChild } = useChildStore()
    const { addToastNotification } = useNotificationStore()

    const [formData, setFormData] = useState<FormData>({
        name: child?.name || '',
        gender: child?.gender || '',
        birthDate: child?.birthDate ? new Date(child.birthDate).toISOString().split('T')[0] : '',
        relationship: child?.relationship || ''
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Nama anak wajib diisi'
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'Nama tidak boleh lebih dari 100 karakter'
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Jenis kelamin wajib dipilih'
        }

        // Birth date validation
        if (!formData.birthDate) {
            newErrors.birthDate = 'Tanggal lahir wajib diisi'
        } else {
            const birthDate = new Date(formData.birthDate)
            const now = new Date()
            const maxAge = new Date()
            maxAge.setFullYear(now.getFullYear() - 18)

            if (birthDate > now) {
                newErrors.birthDate = 'Tanggal lahir tidak boleh di masa depan'
            } else if (birthDate < maxAge) {
                newErrors.birthDate = 'Anak tidak boleh lebih dari 18 tahun'
            }
        }

        // Relationship validation
        if (!formData.relationship.trim()) {
            newErrors.relationship = 'Hubungan keluarga wajib diisi'
        } else if (formData.relationship.trim().length > 50) {
            newErrors.relationship = 'Hubungan keluarga tidak boleh lebih dari 50 karakter'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            const url = mode === 'create' ? '/api/children' : `/api/children/${child?.id}`
            const method = mode === 'create' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    gender: formData.gender,
                    birthDate: formData.birthDate,
                    relationship: formData.relationship.trim()
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.details) {
                    // Handle validation errors from server
                    const serverErrors: FormErrors = {}
                    data.details.forEach((issue: { path?: string[]; message: string }) => {
                        if (issue.path && issue.path.length > 0) {
                            serverErrors[issue.path[0] as keyof FormErrors] = issue.message
                        }
                    })
                    setErrors(serverErrors)
                } else {
                    setErrors({ general: data.error || 'Terjadi kesalahan' })
                }
                return
            }

            // Update local store
            if (mode === 'create') {
                addChild(data.child)
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Berhasil',
                    message: data.message || 'Profil anak berhasil ditambahkan',
                    type: 'success',
                    duration: 5000,
                    autoHide: true
                })
                router.push('/dashboard')
            } else {
                updateChild(child!.id, data.child)
                addToastNotification({
                    id: Date.now().toString(),
                    title: 'Berhasil',
                    message: data.message || 'Profil anak berhasil diperbarui',
                    type: 'success',
                    duration: 5000,
                    autoHide: true
                })
            }

            onSuccess?.()
        } catch (error) {
            console.error('Error submitting form:', error)
            setErrors({ general: 'Terjadi kesalahan jaringan' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                </div>
            )}

            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Anak *
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    placeholder="Masukkan nama anak"
                    maxLength={100}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            {/* Gender Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin *
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'MALE')}
                        className={`p-4 border-2 rounded-lg transition-all ${formData.gender === 'MALE'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">Laki-laki</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'FEMALE')}
                        className={`p-4 border-2 rounded-lg transition-all ${formData.gender === 'FEMALE'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 hover:border-pink-300'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">Perempuan</span>
                        </div>
                    </button>
                </div>
                {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
            </div>

            {/* Birth Date Field */}
            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir *
                </label>
                <input
                    type="date"
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${errors.birthDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    max={new Date().toISOString().split('T')[0]}
                />
                {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
            </div>

            {/* Relationship Field */}
            <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
                    Hubungan Keluarga *
                </label>
                <select
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${errors.relationship ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                >
                    <option value="">Pilih hubungan keluarga</option>
                    <option value="Anak Kandung">Anak Kandung</option>
                    <option value="Anak Tiri">Anak Tiri</option>
                    <option value="Anak Angkat">Anak Angkat</option>
                    <option value="Cucu">Cucu</option>
                    <option value="Keponakan">Keponakan</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
                {errors.relationship && (
                    <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {mode === 'create' ? 'Menambahkan...' : 'Menyimpan...'}
                        </div>
                    ) : (
                        mode === 'create' ? 'Tambah Anak' : 'Simpan Perubahan'
                    )}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    )
}