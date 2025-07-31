'use client'

import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
interface Child {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
    userId: string
}

interface PDFExportModalProps {
    isOpen: boolean
    onClose: () => void
    child: Child
    onExport: (options: ExportOptions) => Promise<void>
    reportType: 'comprehensive' | 'growth' | 'immunization'
}

export interface ExportOptions {
    reportType: 'comprehensive' | 'growth' | 'immunization'
    filename: string
    includeCharts: boolean
    includeGrowthData: boolean
    includeImmunizationData: boolean
    includeMPASIData: boolean
    dateRange?: {
        start: string
        end: string
    }
    clinicName?: string
    doctorName?: string
    emailOptions?: {
        enabled: boolean
        recipients: string[]
        subject: string
        message: string
    }
}

export function PDFExportModal({
    isOpen,
    onClose,
    child,
    onExport,
    reportType
}: PDFExportModalProps) {
    const [isExporting, setIsExporting] = useState(false)
    const [options, setOptions] = useState<ExportOptions>({
        reportType,
        filename: `laporan-${child.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        includeCharts: true,
        includeGrowthData: reportType === 'comprehensive' || reportType === 'growth',
        includeImmunizationData: reportType === 'comprehensive' || reportType === 'immunization',
        includeMPASIData: reportType === 'comprehensive',
        dateRange: {
            start: format(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
            end: format(new Date(), 'yyyy-MM-dd')
        },
        emailOptions: {
            enabled: false,
            recipients: [],
            subject: `Laporan Kesehatan ${child.name}`,
            message: `Terlampir laporan kesehatan untuk ${child.name} periode ${format(new Date(), 'MMMM yyyy', { locale: id })}.`
        }
    })

    const [emailRecipient, setEmailRecipient] = useState('')

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await onExport(options)
            onClose()
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    const addEmailRecipient = () => {
        if (emailRecipient && !options.emailOptions?.recipients.includes(emailRecipient)) {
            setOptions(prev => ({
                ...prev,
                emailOptions: {
                    ...prev.emailOptions!,
                    recipients: [...(prev.emailOptions?.recipients || []), emailRecipient]
                }
            }))
            setEmailRecipient('')
        }
    }

    const removeEmailRecipient = (email: string) => {
        setOptions(prev => ({
            ...prev,
            emailOptions: {
                ...prev.emailOptions!,
                recipients: prev.emailOptions?.recipients.filter(r => r !== email) || []
            }
        }))
    }

    const getReportTitle = () => {
        switch (reportType) {
            case 'comprehensive': return 'Laporan Kesehatan Lengkap'
            case 'growth': return 'Laporan Pertumbuhan'
            case 'immunization': return 'Sertifikat Imunisasi'
            default: return 'Laporan'
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    Ekspor {getReportTitle()}
                                </Dialog.Title>

                                <div className="space-y-6">
                                    {/* Basic Options */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama File
                                        </label>
                                        <input
                                            type="text"
                                            value={options.filename}
                                            onChange={(e) => setOptions(prev => ({ ...prev, filename: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="nama-file.pdf"
                                        />
                                    </div>

                                    {/* Date Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Periode Laporan
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Dari</label>
                                                <input
                                                    type="date"
                                                    value={options.dateRange?.start}
                                                    onChange={(e) => setOptions(prev => ({
                                                        ...prev,
                                                        dateRange: { ...prev.dateRange!, start: e.target.value }
                                                    }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                                                <input
                                                    type="date"
                                                    value={options.dateRange?.end}
                                                    onChange={(e) => setOptions(prev => ({
                                                        ...prev,
                                                        dateRange: { ...prev.dateRange!, end: e.target.value }
                                                    }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Options */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Konten Laporan
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={options.includeCharts}
                                                    onChange={(e) => setOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Sertakan grafik dan chart</span>
                                            </label>

                                            {reportType === 'comprehensive' && (
                                                <>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={options.includeGrowthData}
                                                            onChange={(e) => setOptions(prev => ({ ...prev, includeGrowthData: e.target.checked }))}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Data pertumbuhan</span>
                                                    </label>

                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={options.includeImmunizationData}
                                                            onChange={(e) => setOptions(prev => ({ ...prev, includeImmunizationData: e.target.checked }))}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Data imunisasi</span>
                                                    </label>

                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={options.includeMPASIData}
                                                            onChange={(e) => setOptions(prev => ({ ...prev, includeMPASIData: e.target.checked }))}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Data MPASI</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Clinic/Doctor Information */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Informasi Klinik/Dokter (Opsional)
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={options.clinicName || ''}
                                                    onChange={(e) => setOptions(prev => ({ ...prev, clinicName: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Nama Klinik"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={options.doctorName || ''}
                                                    onChange={(e) => setOptions(prev => ({ ...prev, doctorName: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Nama Dokter"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Options */}
                                    <div>
                                        <label className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={options.emailOptions?.enabled}
                                                onChange={(e) => setOptions(prev => ({
                                                    ...prev,
                                                    emailOptions: { ...prev.emailOptions!, enabled: e.target.checked }
                                                }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Kirim via email setelah ekspor
                                            </span>
                                        </label>

                                        {options.emailOptions?.enabled && (
                                            <div className="space-y-4 pl-6 border-l-2 border-blue-100">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Penerima Email
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="email"
                                                            value={emailRecipient}
                                                            onChange={(e) => setEmailRecipient(e.target.value)}
                                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="email@example.com"
                                                            onKeyPress={(e) => e.key === 'Enter' && addEmailRecipient()}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addEmailRecipient}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            Tambah
                                                        </button>
                                                    </div>

                                                    {options.emailOptions.recipients.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {options.emailOptions.recipients.map((email) => (
                                                                <span
                                                                    key={email}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                                >
                                                                    {email}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeEmailRecipient(email)}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Subjek Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={options.emailOptions.subject}
                                                        onChange={(e) => setOptions(prev => ({
                                                            ...prev,
                                                            emailOptions: { ...prev.emailOptions!, subject: e.target.value }
                                                        }))}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Pesan Email
                                                    </label>
                                                    <textarea
                                                        value={options.emailOptions.message}
                                                        onChange={(e) => setOptions(prev => ({
                                                            ...prev,
                                                            emailOptions: { ...prev.emailOptions!, message: e.target.value }
                                                        }))}
                                                        rows={3}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isExporting}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isExporting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Mengekspor...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Ekspor PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}