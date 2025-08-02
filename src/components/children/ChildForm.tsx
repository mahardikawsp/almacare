'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChildStore } from '@/stores/childStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { Button } from '@/components/ui/button'
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
                <label htmlFor="name" className="block text-sm font-medium text-berkeley-blue mb-2">
                    Nama Anak *
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors min-h-[44px] text-base sm:text-sm ${errors.name ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-alice-blue'
                        }`}
                    placeholder="Masukkan nama anak"
                    maxLength={100}
                    required
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Gender Field */}
            <fieldset>
                <legend className="block text-sm font-medium text-berkeley-blue mb-2">
                    Jenis Kelamin *
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-required="true" aria-invalid={errors.gender ? 'true' : 'false'}>
                    <Button
                        type="button"
                        onClick={() => handleInputChange('gender', 'MALE')}
                        variant="outline"
                        size="default"
                        className={`p-4 border-2 rounded-lg transition-all min-h-[60px] focus:outline-none focus:ring-2 focus:ring-picton-blue focus:ring-offset-2 ${formData.gender === 'MALE'
                            ? 'border-picton-blue bg-alice-blue text-berkeley-blue'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-alice-blue hover:border-picton-blue'
                            }`}
                        role="radio"
                        aria-checked={formData.gender === 'MALE'}
                        aria-label="Pilih jenis kelamin laki-laki"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-picton-blue rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">Laki-laki</span>
                        </div>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleInputChange('gender', 'FEMALE')}
                        variant="outline"
                        size="default"
                        className={`p-4 border-2 rounded-lg transition-all min-h-[60px] focus:outline-none focus:ring-2 focus:ring-picton-blue focus:ring-offset-2 ${formData.gender === 'FEMALE'
                            ? 'border-picton-blue bg-alice-blue text-berkeley-blue'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-alice-blue hover:border-picton-blue'
                            }`}
                        role="radio"
                        aria-checked={formData.gender === 'FEMALE'}
                        aria-label="Pilih jenis kelamin perempuan"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-8 bg-gray rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">Perempuan</span>
                        </div>
                    </Button>
                </div>
                {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.gender}
                    </p>
                )}
            </fieldset>

            {/* Birth Date Field */}
            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-berkeley-blue mb-2">
                    Tanggal Lahir *
                </label>
                <input
                    type="date"
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors min-h-[44px] text-base sm:text-sm ${errors.birthDate ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-alice-blue'
                        }`}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    aria-invalid={errors.birthDate ? 'true' : 'false'}
                    aria-describedby={errors.birthDate ? 'birthDate-error' : 'birthDate-help'}
                />
                <p id="birthDate-help" className="mt-1 text-xs text-neutral-600">
                    Pilih tanggal lahir anak Anda
                </p>
                {errors.birthDate && (
                    <p id="birthDate-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.birthDate}
                    </p>
                )}
            </div>

            {/* Relationship Field */}
            <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-berkeley-blue mb-2">
                    Hubungan Keluarga *
                </label>
                <select
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors min-h-[44px] text-base sm:text-sm appearance-none ${errors.relationship ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-alice-blue'
                        }`}
                    required
                    aria-invalid={errors.relationship ? 'true' : 'false'}
                    aria-describedby={errors.relationship ? 'relationship-error' : 'relationship-help'}
                >
                    <option value="">Pilih hubungan keluarga</option>
                    <option value="Anak Kandung">Anak Kandung</option>
                    <option value="Anak Tiri">Anak Tiri</option>
                    <option value="Anak Angkat">Anak Angkat</option>
                    <option value="Cucu">Cucu</option>
                    <option value="Keponakan">Keponakan</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
                <p id="relationship-help" className="mt-1 text-xs text-neutral-600">
                    Pilih hubungan keluarga Anda dengan anak ini
                </p>
                {errors.relationship && (
                    <p id="relationship-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.relationship}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="default"
                    size="default"
                    className="flex-1 bg-gradient-to-r from-picton-blue to-berkeley-blue hover:from-blue-500 hover:to-blue-800 disabled:from-gray disabled:to-gray text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-describedby={isSubmitting ? 'submit-status' : undefined}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                            <span>{mode === 'create' ? 'Menambahkan...' : 'Menyimpan...'}</span>
                            <span className="sr-only">Sedang memproses, mohon tunggu</span>
                        </div>
                    ) : (
                        mode === 'create' ? 'Tambah Anak' : 'Simpan Perubahan'
                    )}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        variant="outline"
                        size="default"
                        className="px-6 py-3 border border-alice-blue text-berkeley-blue font-medium rounded-lg hover:bg-alice-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label="Batalkan perubahan dan kembali"
                    >
                        Batal
                    </Button>
                )}
            </div>

            {isSubmitting && (
                <div id="submit-status" className="sr-only" aria-live="polite">
                    {mode === 'create' ? 'Sedang menambahkan profil anak' : 'Sedang menyimpan perubahan profil anak'}
                </div>
            )}
        </form>
    )
}