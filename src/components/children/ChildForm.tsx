'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChildStore } from '@/stores/childStore'
import { Button } from '@/components/ui/Button'
import { FormField, Input } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/notifications/NotificationSystem'
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

    const toast = useToast()

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
                toast.success(
                    'Profil Berhasil Ditambahkan',
                    data.message || 'Profil anak berhasil ditambahkan'
                )
                router.push('/dashboard')
            } else {
                updateChild(child!.id, data.child)
                toast.success(
                    'Profil Berhasil Diperbarui',
                    data.message || 'Profil anak berhasil diperbarui'
                )
            }

            onSuccess?.()
        } catch (error) {
            console.error('Error submitting form:', error)
            toast.error('Kesalahan Jaringan', 'Terjadi kesalahan jaringan. Silakan coba lagi.')
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
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
                {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-red-600 font-medium">{errors.general}</p>
                    </div>
                )}

                {/* Name Field */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        Nama Anak *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama anak"
                        maxLength={100}
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base font-medium ${errors.name ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Gender Field */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        Jenis Kelamin *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`relative flex items-center justify-center p-5 border-2 rounded-2xl transition-all duration-300 min-h-[80px] cursor-pointer group ${formData.gender === 'MALE'
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105'
                            }`}>
                            <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={formData.gender === 'MALE'}
                                onChange={() => handleInputChange('gender', 'MALE')}
                                className="sr-only"
                            />
                            <div className="flex items-center justify-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${formData.gender === 'MALE' ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'}`}>
                                    <svg className={`w-6 h-6 ${formData.gender === 'MALE' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-900">Laki-laki</span>
                            </div>
                        </label>
                        <label className={`relative flex items-center justify-center p-5 border-2 rounded-2xl transition-all duration-300 min-h-[80px] cursor-pointer group ${formData.gender === 'FEMALE'
                            ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:scale-105'
                            }`}>
                            <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={formData.gender === 'FEMALE'}
                                onChange={() => handleInputChange('gender', 'FEMALE')}
                                className="sr-only"
                            />
                            <div className="flex items-center justify-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${formData.gender === 'FEMALE' ? 'bg-pink-500' : 'bg-pink-100 group-hover:bg-pink-200'}`}>
                                    <svg className={`w-6 h-6 ${formData.gender === 'FEMALE' ? 'text-white' : 'text-pink-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-900">Perempuan</span>
                            </div>
                        </label>
                    </div>
                    {errors.gender && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.gender}
                        </p>
                    )}
                </div>

                {/* Birth Date Field */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        Tanggal Lahir *
                    </label>
                    <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base font-medium ${errors.birthDate ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <p className="text-sm text-gray-600">Pilih tanggal lahir anak Anda</p>
                    {errors.birthDate && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.birthDate}
                        </p>
                    )}
                </div>

                {/* Relationship Field */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        Hubungan Keluarga *
                    </label>
                    <div className="relative">
                        <select
                            value={formData.relationship}
                            onChange={(e) => handleInputChange('relationship', e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-base font-medium appearance-none bg-white ${errors.relationship ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-orange-300'
                                }`}
                            required
                        >
                            <option value="">Pilih hubungan keluarga</option>
                            <option value="Anak Kandung">Anak Kandung</option>
                            <option value="Anak Tiri">Anak Tiri</option>
                            <option value="Anak Angkat">Anak Angkat</option>
                            <option value="Cucu">Cucu</option>
                            <option value="Keponakan">Keponakan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Pilih hubungan keluarga Anda dengan anak ini</p>
                    {errors.relationship && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.relationship}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {mode === 'create' ? 'Tambah Anak' : 'Simpan Perubahan'}
                            </>
                        )}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="sm:w-auto bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Batal
                        </button>
                    )}
                </div>

                {isSubmitting && (
                    <div id="submit-status" className="sr-only" aria-live="polite">
                        {mode === 'create' ? 'Sedang menambahkan profil anak' : 'Sedang menyimpan perubahan profil anak'}
                    </div>
                )}
            </form>
        </div>
    )
}