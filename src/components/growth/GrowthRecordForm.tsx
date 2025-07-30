'use client'

import { useState } from 'react'
import { useChildStore } from '@/stores/childStore'
import { useGrowthStore } from '@/stores/growthStore'
import { PlusIcon } from '@/components/icons/PlusIcon'

interface GrowthRecordFormProps {
    onSuccess?: () => void
    onCancel?: () => void
    initialData?: {
        date?: string
        weight?: number
        height?: number
        headCircumference?: number
    }
    recordId?: string
}

export function GrowthRecordForm({
    onSuccess,
    onCancel,
    initialData,
    recordId
}: GrowthRecordFormProps) {
    const { selectedChild } = useChildStore()
    const { addGrowthRecord, updateGrowthRecord } = useGrowthStore()

    const [formData, setFormData] = useState({
        date: initialData?.date || new Date().toISOString().split('T')[0],
        weight: initialData?.weight || '',
        height: initialData?.height || '',
        headCircumference: initialData?.headCircumference || ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.date) {
            newErrors.date = 'Tanggal pengukuran wajib diisi'
        }

        const weight = parseFloat(formData.weight as string)
        if (!formData.weight || isNaN(weight) || weight <= 0 || weight > 50) {
            newErrors.weight = 'Berat badan harus antara 0.1 - 50 kg'
        }

        const height = parseFloat(formData.height as string)
        if (!formData.height || isNaN(height) || height <= 0 || height > 150) {
            newErrors.height = 'Tinggi badan harus antara 1 - 150 cm'
        }

        const headCircumference = parseFloat(formData.headCircumference as string)
        if (formData.headCircumference && (isNaN(headCircumference) || headCircumference <= 0 || headCircumference > 70)) {
            newErrors.headCircumference = 'Lingkar kepala harus antara 1 - 70 cm'
        }

        // Validate date is not in the future
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(23, 59, 59, 999) // End of today

        if (selectedDate > today) {
            newErrors.date = 'Tanggal pengukuran tidak boleh di masa depan'
        }

        // Validate date is not before birth date
        if (selectedChild) {
            const birthDate = new Date(selectedChild.birthDate)
            if (selectedDate < birthDate) {
                newErrors.date = 'Tanggal pengukuran tidak boleh sebelum tanggal lahir'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedChild) {
            alert('Pilih anak terlebih dahulu')
            return
        }

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                childId: selectedChild.id,
                date: new Date(formData.date).toISOString(),
                weight: parseFloat(formData.weight as string),
                height: parseFloat(formData.height as string),
                ...(formData.headCircumference && {
                    headCircumference: parseFloat(formData.headCircumference as string)
                })
            }

            const url = recordId ? `/api/growth/${recordId}` : '/api/growth'
            const method = recordId ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Gagal menyimpan data pertumbuhan')
            }

            // Update store
            if (recordId) {
                updateGrowthRecord(recordId, result.data)
            } else {
                addGrowthRecord(result.data)
            }

            // Show success message
            alert(recordId ? 'Data pertumbuhan berhasil diperbarui!' : 'Data pertumbuhan berhasil disimpan!')

            // Reset form if creating new record
            if (!recordId) {
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    weight: '',
                    height: '',
                    headCircumference: ''
                })
            }

            onSuccess?.()
        } catch (error) {
            console.error('Error saving growth record:', error)
            alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    if (!selectedChild) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    Pilih anak terlebih dahulu untuk menambahkan data pertumbuhan.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {recordId ? 'Edit Data Pertumbuhan' : 'Tambah Data Pertumbuhan'}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {selectedChild.name} • {selectedChild.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Input */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-berkeley-blue mb-2">
                        Tanggal Pengukuran *
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue ${errors.date ? 'border-berkeley-blue' : 'border-alice-blue'
                            }`}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                </div>

                {/* Weight Input */}
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-berkeley-blue mb-2">
                        Berat Badan (kg) *
                    </label>
                    <input
                        type="number"
                        id="weight"
                        step="0.1"
                        min="0.1"
                        max="50"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="Contoh: 3.5"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue ${errors.weight ? 'border-berkeley-blue' : 'border-alice-blue'
                            }`}
                    />
                    {errors.weight && (
                        <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                    )}
                </div>

                {/* Height Input */}
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-berkeley-blue mb-2">
                        Tinggi Badan (cm) *
                    </label>
                    <input
                        type="number"
                        id="height"
                        step="0.1"
                        min="1"
                        max="150"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="Contoh: 50.5"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue ${errors.height ? 'border-berkeley-blue' : 'border-alice-blue'
                            }`}
                    />
                    {errors.height && (
                        <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                    )}
                </div>

                {/* Head Circumference Input */}
                <div>
                    <label htmlFor="headCircumference" className="block text-sm font-medium text-berkeley-blue mb-2">
                        Lingkar Kepala (cm)
                    </label>
                    <input
                        type="number"
                        id="headCircumference"
                        step="0.1"
                        min="1"
                        max="70"
                        value={formData.headCircumference}
                        onChange={(e) => handleInputChange('headCircumference', e.target.value)}
                        placeholder="Contoh: 35.0 (opsional)"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-picton-blue focus:border-picton-blue ${errors.headCircumference ? 'border-berkeley-blue' : 'border-alice-blue'
                            }`}
                    />
                    {errors.headCircumference && (
                        <p className="mt-1 text-sm text-red-600">{errors.headCircumference}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Lingkar kepala opsional, namun direkomendasikan untuk anak di bawah 2 tahun
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-picton-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-berkeley-blue focus:ring-2 focus:ring-picton-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Menyimpan...' : (recordId ? 'Perbarui Data' : 'Simpan Data')}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-alice-blue text-berkeley-blue rounded-lg font-medium hover:bg-alice-blue focus:ring-2 focus:ring-picton-blue focus:ring-offset-2 transition-colors"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}