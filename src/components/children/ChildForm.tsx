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
        <Card className="p-4 sm:p-6 w-full">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                )}

                {/* Name Field */}
                <FormField
                    label="Nama Anak"
                    error={errors.name}
                    required
                >
                    <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama anak"
                        maxLength={100}
                        error={!!errors.name}
                    />
                </FormField>

                {/* Gender Field */}
                <fieldset className="w-full">
                    <legend className="block text-sm font-medium text-berkeley-blue mb-3">
                        Jenis Kelamin *
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full" role="radiogroup" aria-required="true" aria-invalid={errors.gender ? 'true' : 'false'}>
                        <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl transition-all min-h-[64px] cursor-pointer focus-within:ring-2 focus-within:ring-picton-blue focus-within:ring-offset-2 ${formData.gender === 'MALE'
                            ? 'border-picton-blue bg-alice-blue text-berkeley-blue'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-alice-blue hover:border-picton-blue hover:bg-alice-blue/50'
                            }`}>
                            <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={formData.gender === 'MALE'}
                                onChange={() => handleInputChange('gender', 'MALE')}
                                className="sr-only"
                                aria-label="Pilih jenis kelamin laki-laki"
                            />
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 bg-picton-blue rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-medium text-sm sm:text-base">Laki-laki</span>
                            </div>
                        </label>
                        <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl transition-all min-h-[64px] cursor-pointer focus-within:ring-2 focus-within:ring-picton-blue focus-within:ring-offset-2 ${formData.gender === 'FEMALE'
                            ? 'border-picton-blue bg-alice-blue text-berkeley-blue'
                            : errors.gender
                                ? 'border-red-300 bg-red-50'
                                : 'border-alice-blue hover:border-picton-blue hover:bg-alice-blue/50'
                            }`}>
                            <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={formData.gender === 'FEMALE'}
                                onChange={() => handleInputChange('gender', 'FEMALE')}
                                className="sr-only"
                                aria-label="Pilih jenis kelamin perempuan"
                            />
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 bg-gray rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-medium text-sm sm:text-base">Perempuan</span>
                            </div>
                        </label>
                    </div>
                    {errors.gender && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.gender}
                        </p>
                    )}
                </fieldset>

                {/* Birth Date Field */}
                <FormField
                    label="Tanggal Lahir"
                    error={errors.birthDate}
                    required
                    helpText="Pilih tanggal lahir anak Anda"
                >
                    <input
                        type="date"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors min-h-[48px] text-base ${errors.birthDate ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-alice-blue hover:border-picton-blue'
                            }`}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        aria-invalid={errors.birthDate ? 'true' : 'false'}
                    />
                </FormField>

                {/* Relationship Field */}
                <FormField
                    label="Hubungan Keluarga"
                    error={errors.relationship}
                    required
                    helpText="Pilih hubungan keluarga Anda dengan anak ini"
                >
                    <div className="relative">
                        <select
                            id="relationship"
                            value={formData.relationship}
                            onChange={(e) => handleInputChange('relationship', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-picton-blue focus:border-picton-blue transition-colors min-h-[48px] text-base appearance-none bg-white ${errors.relationship ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-alice-blue hover:border-picton-blue'
                                }`}
                            required
                            aria-invalid={errors.relationship ? 'true' : 'false'}
                        >
                            <option value="">Pilih hubungan keluarga</option>
                            <option value="Anak Kandung">Anak Kandung</option>
                            <option value="Anak Tiri">Anak Tiri</option>
                            <option value="Anak Angkat">Anak Angkat</option>
                            <option value="Cucu">Cucu</option>
                            <option value="Keponakan">Keponakan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </FormField>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="flex-1"
                        size="lg"
                    >
                        {mode === 'create' ? 'Tambah Anak' : 'Simpan Perubahan'}
                    </Button>

                    {onCancel && (
                        <Button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            variant="outline"
                            size="lg"
                            className="sm:w-auto"
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
        </Card>
    )
}