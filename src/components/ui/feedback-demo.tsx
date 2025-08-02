"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast, toastSuccess, toastError, toastWarning, toastInfo } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    Heart,
    Baby,
    Calendar,
    TrendingUp
} from "lucide-react"

export function FeedbackDemo() {
    const { toast } = useToast()

    const showToasts = () => {
        // Success toast
        toastSuccess(
            "Data berhasil disimpan!",
            "Informasi pertumbuhan bayi telah tersimpan dengan aman."
        )

        // Info toast with delay
        setTimeout(() => {
            toastInfo(
                "Pengingat Imunisasi",
                "Jadwal imunisasi DPT berikutnya dalam 2 minggu."
            )
        }, 1000)

        // Warning toast with delay
        setTimeout(() => {
            toastWarning(
                "Periksa Berat Badan",
                "Berat badan bayi belum diperbarui selama 2 minggu."
            )
        }, 2000)
    }

    const showErrorToast = () => {
        toastError(
            "Gagal menyimpan data",
            "Terjadi kesalahan saat menyimpan. Silakan coba lagi."
        )
    }

    const showCustomToast = () => {
        toast({
            title: "Selamat! 🎉",
            description: "Bayi Anda telah mencapai milestone baru: duduk sendiri!",
            variant: "success",
            duration: 6000,
            action: (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("Lihat milestone")}
                >
                    Lihat Detail
                </Button>
            ),
        })
    }

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#163461] font-nunito">
                    Komponen Feedback & Notifikasi
                </h1>
                <p className="text-[#7C7D7F] font-nunito">
                    Toast dan Alert dengan styling BayiCare dan dukungan aksesibilitas
                </p>
            </div>

            {/* Toast Demo Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Heart className="h-5 w-5 text-[#04A3E8]" />
                        Demo Toast Notifications
                    </CardTitle>
                    <CardDescription>
                        Notifikasi toast dengan positioning mobile-friendly dan ARIA announcements
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            onClick={() => toastSuccess("Berhasil!", "Data telah disimpan.")}
                            className="bg-[#04A3E8] hover:bg-[#0392d1]"
                        >
                            Success Toast
                        </Button>
                        <Button
                            onClick={showErrorToast}
                            variant="destructive"
                            className="bg-[#163461] hover:bg-[#1a3a6b]"
                        >
                            Error Toast
                        </Button>
                        <Button
                            onClick={() => toastWarning("Peringatan", "Periksa data Anda.")}
                            className="bg-[#7C7D7F] hover:bg-[#6b6c6e]"
                        >
                            Warning Toast
                        </Button>
                        <Button
                            onClick={() => toastInfo("Info", "Informasi penting untuk Anda.")}
                            variant="outline"
                            className="border-[#04A3E8] text-[#04A3E8] hover:bg-[#F1F5FC]"
                        >
                            Info Toast
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            onClick={showToasts}
                            className="bg-gradient-to-r from-[#04A3E8] to-[#163461] text-white"
                        >
                            Multiple Toasts
                        </Button>
                        <Button
                            onClick={showCustomToast}
                            variant="outline"
                            className="border-[#04A3E8] text-[#04A3E8] hover:bg-[#F1F5FC]"
                        >
                            Custom Toast with Action
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Alert Demo Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Baby className="h-5 w-5 text-[#04A3E8]" />
                        Demo Alert Components
                    </CardTitle>
                    <CardDescription>
                        Alert components dengan berbagai varian untuk konteks BayiCare
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Default Alert */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Informasi Umum</AlertTitle>
                        <AlertDescription>
                            Ini adalah alert default dengan styling BayiCare. Cocok untuk informasi umum
                            yang perlu diperhatikan pengguna.
                        </AlertDescription>
                    </Alert>

                    {/* Success Alert */}
                    <Alert variant="success">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Data Berhasil Disimpan</AlertTitle>
                        <AlertDescription>
                            Informasi pertumbuhan bayi Anda telah berhasil disimpan ke dalam sistem.
                            Data dapat dilihat di halaman riwayat pertumbuhan.
                        </AlertDescription>
                    </Alert>

                    {/* Warning Alert */}
                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Peringatan Jadwal Imunisasi</AlertTitle>
                        <AlertDescription>
                            Jadwal imunisasi DPT berikutnya sudah dekat. Pastikan untuk membuat janji
                            dengan dokter anak Anda sebelum tanggal jatuh tempo.
                        </AlertDescription>
                    </Alert>

                    {/* Destructive Alert */}
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Perhatian: Data Tidak Lengkap</AlertTitle>
                        <AlertDescription>
                            Beberapa informasi penting masih kosong. Lengkapi data tinggi dan berat badan
                            untuk mendapatkan analisis pertumbuhan yang akurat.
                        </AlertDescription>
                    </Alert>

                    {/* Info Alert */}
                    <Alert variant="info">
                        <TrendingUp className="h-4 w-4" />
                        <AlertTitle>Tips Pertumbuhan Sehat</AlertTitle>
                        <AlertDescription>
                            Berdasarkan data pertumbuhan, bayi Anda berkembang dengan baik.
                            Lanjutkan pola makan dan tidur yang teratur untuk mendukung pertumbuhan optimal.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Mobile Responsiveness Demo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Calendar className="h-5 w-5 text-[#04A3E8]" />
                        Responsive & Accessibility Features
                    </CardTitle>
                    <CardDescription>
                        Fitur-fitur khusus untuk mobile dan aksesibilitas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">Mobile-First Design</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• Toast positioning: top pada mobile, bottom-right pada desktop</li>
                                <li>• Touch targets minimum 44px untuk semua tombol</li>
                                <li>• Safe area support untuk device dengan notch</li>
                                <li>• Font size 16px pada mobile untuk mencegah zoom</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">Accessibility Features</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• ARIA live regions untuk screen reader announcements</li>
                                <li>• Proper focus management dan keyboard navigation</li>
                                <li>• High contrast mode support</li>
                                <li>• Reduced motion support untuk animasi</li>
                                <li>• Indonesian language labels dan descriptions</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Toaster component for displaying toasts */}
            <Toaster />
        </div>
    )
}