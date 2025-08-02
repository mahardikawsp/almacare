"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function DialogSheetDemo() {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false)
    const [leftSheetOpen, setLeftSheetOpen] = React.useState(false)
    const [rightSheetOpen, setRightSheetOpen] = React.useState(false)
    const [topSheetOpen, setTopSheetOpen] = React.useState(false)

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-berkeley-blue">
                    Dialog & Sheet Components Demo
                </h1>
                <p className="text-gray">
                    Demonstrasi komponen Dialog dan Sheet yang dioptimalkan untuk mobile dengan safe area handling
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dialog Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Dialog</h2>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full">
                                Buka Dialog
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profil Anak</DialogTitle>
                                <DialogDescription>
                                    Ubah informasi profil anak Anda di sini. Klik simpan ketika selesai.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        defaultValue="Aisyah"
                                        placeholder="Masukkan nama anak"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birthdate">Tanggal Lahir</Label>
                                    <Input
                                        id="birthdate"
                                        type="date"
                                        defaultValue="2023-06-15"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Catatan</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Catatan tambahan tentang anak"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button onClick={() => setDialogOpen(false)}>
                                    Simpan Perubahan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Bottom Sheet Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Bottom Sheet</h2>

                    <Sheet open={bottomSheetOpen} onOpenChange={setBottomSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                Buka Bottom Sheet
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom">
                            <SheetHeader>
                                <SheetTitle>Tambah Data Pertumbuhan</SheetTitle>
                                <SheetDescription>
                                    Masukkan data berat dan tinggi badan anak terbaru
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="weight">Berat Badan (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="7.5"
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="height">Tinggi Badan (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            placeholder="68"
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="measurement-date">Tanggal Pengukuran</Label>
                                    <Input
                                        id="measurement-date"
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="growth-notes">Catatan</Label>
                                    <Textarea
                                        id="growth-notes"
                                        placeholder="Catatan tambahan tentang pengukuran"
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setBottomSheetOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button onClick={() => setBottomSheetOpen(false)}>
                                    Simpan Data
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Left Sheet Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Left Sheet</h2>

                    <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                Buka Left Sheet
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu Navigasi</SheetTitle>
                                <SheetDescription>
                                    Pilih menu untuk navigasi cepat
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start">
                                        📊 Dashboard
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        👶 Data Anak
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        📈 Pertumbuhan
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        💉 Imunisasi
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        🍼 MPASI
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start">
                                        📋 Laporan
                                    </Button>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setLeftSheetOpen(false)}
                                    className="w-full"
                                >
                                    Tutup Menu
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Right Sheet Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Right Sheet</h2>

                    <Sheet open={rightSheetOpen} onOpenChange={setRightSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                Buka Right Sheet
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Detail Imunisasi</SheetTitle>
                                <SheetDescription>
                                    Informasi lengkap jadwal imunisasi
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-3">
                                    <div className="p-3 bg-alice-blue rounded-lg">
                                        <h4 className="font-medium text-berkeley-blue">BCG</h4>
                                        <p className="text-sm text-gray">Usia: 0-2 bulan</p>
                                        <p className="text-sm text-green-600">✅ Sudah diberikan</p>
                                    </div>
                                    <div className="p-3 bg-alice-blue rounded-lg">
                                        <h4 className="font-medium text-berkeley-blue">DPT 1</h4>
                                        <p className="text-sm text-gray">Usia: 2 bulan</p>
                                        <p className="text-sm text-orange-600">⏰ Jadwal: 15 Agt 2024</p>
                                    </div>
                                    <div className="p-3 bg-alice-blue rounded-lg">
                                        <h4 className="font-medium text-berkeley-blue">Polio 1</h4>
                                        <p className="text-sm text-gray">Usia: 2 bulan</p>
                                        <p className="text-sm text-orange-600">⏰ Jadwal: 15 Agt 2024</p>
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    onClick={() => setRightSheetOpen(false)}
                                    className="w-full"
                                >
                                    Atur Pengingat
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Top Sheet Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Top Sheet</h2>

                    <Sheet open={topSheetOpen} onOpenChange={setTopSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">
                                Buka Top Sheet
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top">
                            <SheetHeader>
                                <SheetTitle>Notifikasi Penting</SheetTitle>
                                <SheetDescription>
                                    Pengingat jadwal imunisasi dan kontrol kesehatan
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-3">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h4 className="font-medium text-yellow-800">Jadwal Imunisasi</h4>
                                    <p className="text-sm text-yellow-700">
                                        DPT 1 dan Polio 1 dijadwalkan besok (15 Agustus 2024)
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-medium text-blue-800">Kontrol Rutin</h4>
                                    <p className="text-sm text-blue-700">
                                        Jadwal kontrol pertumbuhan minggu depan
                                    </p>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setTopSheetOpen(false)}
                                >
                                    Tutup
                                </Button>
                                <Button onClick={() => setTopSheetOpen(false)}>
                                    Atur Pengingat
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Accessibility Demo */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-berkeley-blue">Accessibility Test</h2>
                    <div className="text-sm text-gray space-y-2">
                        <p>• Keyboard navigation: Tab, Enter, Escape</p>
                        <p>• Screen reader support dengan ARIA labels</p>
                        <p>• Focus trap dalam modal</p>
                        <p>• Reduced motion support</p>
                        <p>• High contrast mode compatible</p>
                        <p>• Touch-friendly (44px minimum)</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-alice-blue rounded-lg">
                <h3 className="font-semibold text-berkeley-blue mb-2">Fitur Mobile-First:</h3>
                <ul className="text-sm text-gray space-y-1">
                    <li>✅ Safe area handling untuk device dengan notch</li>
                    <li>✅ Touch-friendly close buttons (44px minimum)</li>
                    <li>✅ Smooth animations dengan reduced motion support</li>
                    <li>✅ Responsive design untuk semua ukuran layar</li>
                    <li>✅ Drag handle untuk bottom sheet</li>
                    <li>✅ Proper focus management dan keyboard navigation</li>
                    <li>✅ Indonesian language support</li>
                    <li>✅ BayiCare color palette integration</li>
                </ul>
            </div>
        </div>
    )
}