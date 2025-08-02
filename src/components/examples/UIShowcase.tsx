'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { FormField, Input, Select } from '@/components/ui/FormField'
import { LoadingState, CardLoadingState, TableLoadingState } from '@/components/ui/LoadingState'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/components/notifications/NotificationSystem'
import {
    HeartIcon,
    ChartBarIcon,
    CalendarIcon,
    BookOpenIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline'

export function UIShowcase() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', category: '' })
    const toast = useToast()

    const handleLoadingDemo = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success('Demo Selesai', 'Loading state berhasil ditampilkan!')
        }, 3000)
    }

    const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
        const messages = {
            success: { title: 'Berhasil!', description: 'Operasi berhasil dilakukan' },
            error: { title: 'Terjadi Kesalahan', description: 'Silakan coba lagi nanti' },
            warning: { title: 'Peringatan', description: 'Harap periksa data Anda' },
            info: { title: 'Informasi', description: 'Ada pembaruan tersedia' }
        }

        toast[type](messages[type].title, messages[type].description)
    }

    const sampleData = [
        { id: 1, name: 'Ahmad', age: '2 tahun', status: 'Normal' },
        { id: 2, name: 'Siti', age: '1.5 tahun', status: 'Perlu Perhatian' },
        { id: 3, name: 'Budi', age: '3 tahun', status: 'Normal' },
    ]

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                    BayiCare UI Components Showcase
                </h1>
                <p className="text-neutral-600">
                    Demonstrasi komponen UI yang telah diperbarui dengan shadcn/ui
                </p>
            </div>

            {/* Buttons Section */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="accent">Accent</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button loading>Loading</Button>
                    <Button icon={<PlusIcon />}>With Icon</Button>
                    <Button icon={<TrashIcon />} iconPosition="right">Icon Right</Button>
                </div>
            </Card>

            {/* Toast Notifications */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Toast Notifications</h2>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={() => handleToastDemo('success')} variant="outline">
                        Success Toast
                    </Button>
                    <Button onClick={() => handleToastDemo('error')} variant="outline">
                        Error Toast
                    </Button>
                    <Button onClick={() => handleToastDemo('warning')} variant="outline">
                        Warning Toast
                    </Button>
                    <Button onClick={() => handleToastDemo('info')} variant="outline">
                        Info Toast
                    </Button>
                </div>
            </Card>

            {/* Tabs Section */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Tabs</h2>
                <Tabs defaultValue="growth" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="growth">Pertumbuhan</TabsTrigger>
                        <TabsTrigger value="immunization">Imunisasi</TabsTrigger>
                        <TabsTrigger value="mpasi">MPASI</TabsTrigger>
                        <TabsTrigger value="reports">Laporan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="growth" className="mt-4">
                        <div className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg">
                            <ChartBarIcon className="w-8 h-8 text-primary-500" />
                            <div>
                                <h3 className="font-semibold">Pantau Pertumbuhan</h3>
                                <p className="text-sm text-neutral-600">Catat berat, tinggi, dan lingkar kepala anak</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="immunization" className="mt-4">
                        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                            <CalendarIcon className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-semibold">Jadwal Imunisasi</h3>
                                <p className="text-sm text-neutral-600">Jangan lewatkan jadwal vaksin penting</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="mpasi" className="mt-4">
                        <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                            <BookOpenIcon className="w-8 h-8 text-orange-500" />
                            <div>
                                <h3 className="font-semibold">Menu MPASI</h3>
                                <p className="text-sm text-neutral-600">Resep sehat untuk anak 6+ bulan</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="reports" className="mt-4">
                        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                            <HeartIcon className="w-8 h-8 text-green-500" />
                            <div>
                                <h3 className="font-semibold">Laporan Kesehatan</h3>
                                <p className="text-sm text-neutral-600">Ringkasan perkembangan anak</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* Accordion Section */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Accordion</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Apa itu Z-score?</AccordionTrigger>
                        <AccordionContent>
                            Z-score adalah ukuran statistik yang menunjukkan seberapa jauh nilai pengukuran
                            anak dari rata-rata populasi. Nilai Z-score antara -2 dan +2 dianggap normal.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Kapan mulai MPASI?</AccordionTrigger>
                        <AccordionContent>
                            MPASI (Makanan Pendamping ASI) sebaiknya dimulai saat anak berusia 6 bulan.
                            Pada usia ini, sistem pencernaan anak sudah siap menerima makanan padat.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Jadwal imunisasi wajib?</AccordionTrigger>
                        <AccordionContent>
                            Jadwal imunisasi mengikuti standar Kementerian Kesehatan RI, dimulai dari
                            HB-0 saat lahir, BCG dan Polio 1 di usia 1 bulan, dan seterusnya.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            {/* Table Section */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Table</h2>
                {isLoading ? (
                    <TableLoadingState rows={3} columns={3} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Anak</TableHead>
                                <TableHead>Usia</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sampleData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.age}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Normal'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Form Section */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Form Components</h2>
                <div className="space-y-4 max-w-md">
                    <FormField
                        label="Nama Lengkap"
                        hint="Masukkan nama lengkap anak"
                        required
                    >
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Contoh: Ahmad Fauzi"
                        />
                    </FormField>

                    <FormField
                        label="Email Orang Tua"
                        error={formData.email && !formData.email.includes('@') ? 'Format email tidak valid' : undefined}
                    >
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contoh@email.com"
                            error={formData.email && !formData.email.includes('@')}
                        />
                    </FormField>

                    <FormField
                        label="Kategori"
                        required
                    >
                        <Select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="Pilih kategori"
                        >
                            <option value="bayi">Bayi (0-12 bulan)</option>
                            <option value="balita">Balita (1-5 tahun)</option>
                            <option value="anak">Anak (5+ tahun)</option>
                        </Select>
                    </FormField>
                </div>
            </Card>

            {/* Loading States */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Loading States</h2>
                <div className="space-y-4">
                    <div className="flex gap-4 mb-4">
                        <Button onClick={handleLoadingDemo} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Demo Loading States'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium mb-2">Spinner Loading</h3>
                            <LoadingState type="spinner" text="Memuat data..." />
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Dots Loading</h3>
                            <LoadingState type="dots" text="Menyimpan..." />
                        </div>
                    </div>

                    {isLoading && (
                        <div>
                            <h3 className="font-medium mb-2">Card Loading Skeleton</h3>
                            <CardLoadingState />
                        </div>
                    )}
                </div>
            </Card>

            {/* Tooltips */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Tooltips</h2>
                <div className="flex gap-4">
                    <Tooltip content="Ini adalah tooltip di atas" position="top">
                        <Button variant="outline">Hover untuk tooltip atas</Button>
                    </Tooltip>
                    <Tooltip content="Ini adalah tooltip di bawah" position="bottom">
                        <Button variant="outline">Hover untuk tooltip bawah</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip dengan delay 1 detik" delay={1000}>
                        <Button variant="outline">Tooltip dengan delay</Button>
                    </Tooltip>
                </div>
            </Card>
        </div>
    )
}