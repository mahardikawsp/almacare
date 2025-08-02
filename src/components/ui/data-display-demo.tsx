"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { ResponsiveTable, GrowthTable, ImmunizationTable } from "@/components/ui/responsive-table"
import { Badge } from "@/components/ui/badge"
import {
    Baby,
    TrendingUp,
    Calendar,
    Heart,
    Shield,
    Activity,
    Users,
    Clock,
    CheckCircle,
    AlertTriangle,
    Info
} from "lucide-react"

// Sample data for demonstrations
const sampleGrowthData = [
    {
        date: '2024-01-15',
        age: '6 bulan',
        weight: 7.2,
        height: 65,
        headCircumference: 42,
        status: 'normal' as const
    },
    {
        date: '2024-02-15',
        age: '7 bulan',
        weight: 7.8,
        height: 67,
        headCircumference: 43,
        status: 'normal' as const
    },
    {
        date: '2024-03-15',
        age: '8 bulan',
        weight: 8.1,
        height: 68,
        headCircumference: 43.5,
        status: 'warning' as const
    }
]

const sampleImmunizationData = [
    {
        vaccine: 'BCG',
        scheduledDate: '2023-08-15',
        actualDate: '2023-08-15',
        status: 'completed' as const,
        notes: 'Tidak ada reaksi'
    },
    {
        vaccine: 'DPT 1',
        scheduledDate: '2023-10-15',
        actualDate: '2023-10-16',
        status: 'completed' as const,
        notes: 'Demam ringan'
    },
    {
        vaccine: 'DPT 2',
        scheduledDate: '2024-01-15',
        status: 'due' as const
    },
    {
        vaccine: 'MMR',
        scheduledDate: '2024-08-15',
        status: 'upcoming' as const
    }
]

const sampleMpasiData = [
    { food: 'Bubur Beras', age: '6 bulan', frequency: '2x sehari', reaction: 'Baik' },
    { food: 'Pisang Lumat', age: '6 bulan', frequency: '1x sehari', reaction: 'Baik' },
    { food: 'Wortel Kukus', age: '7 bulan', frequency: '1x sehari', reaction: 'Alergi Ringan' },
    { food: 'Ayam Cincang', age: '8 bulan', frequency: '1x sehari', reaction: 'Baik' }
]

export function DataDisplayDemo() {
    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#163461] font-nunito">
                    Komponen Data Display
                </h1>
                <p className="text-[#7C7D7F] font-nunito">
                    Table, Tabs, dan Accordion dengan responsive design dan keyboard navigation
                </p>
            </div>

            {/* Tabs Demo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Baby className="h-5 w-5 text-[#04A3E8]" />
                        Demo Tabs Component
                    </CardTitle>
                    <CardDescription>
                        Tabs dengan styling BayiCare dan keyboard navigation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="growth" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="growth" className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span className="hidden sm:inline">Pertumbuhan</span>
                                <span className="sm:hidden">Growth</span>
                            </TabsTrigger>
                            <TabsTrigger value="immunization" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden sm:inline">Imunisasi</span>
                                <span className="sm:hidden">Vaksin</span>
                            </TabsTrigger>
                            <TabsTrigger value="mpasi" className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">MPASI</span>
                                <span className="sm:hidden">Food</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="growth" className="space-y-4">
                            <div className="flex items-center gap-2 text-[#163461]">
                                <TrendingUp className="h-5 w-5 text-[#04A3E8]" />
                                <h3 className="text-lg font-semibold">Data Pertumbuhan</h3>
                            </div>
                            <p className="text-[#7C7D7F] text-sm">
                                Grafik dan data pertumbuhan bayi berdasarkan standar WHO
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#F1F5FC] p-4 rounded-xl border border-[#EEF3FC]">
                                    <div className="text-2xl font-bold text-[#04A3E8]">8.1 kg</div>
                                    <div className="text-sm text-[#7C7D7F]">Berat Badan Terakhir</div>
                                </div>
                                <div className="bg-[#F1F5FC] p-4 rounded-xl border border-[#EEF3FC]">
                                    <div className="text-2xl font-bold text-[#04A3E8]">68 cm</div>
                                    <div className="text-sm text-[#7C7D7F]">Tinggi Badan Terakhir</div>
                                </div>
                                <div className="bg-[#F1F5FC] p-4 rounded-xl border border-[#EEF3FC]">
                                    <div className="text-2xl font-bold text-[#04A3E8]">Normal</div>
                                    <div className="text-sm text-[#7C7D7F]">Status Pertumbuhan</div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="immunization" className="space-y-4">
                            <div className="flex items-center gap-2 text-[#163461]">
                                <Shield className="h-5 w-5 text-[#04A3E8]" />
                                <h3 className="text-lg font-semibold">Jadwal Imunisasi</h3>
                            </div>
                            <p className="text-[#7C7D7F] text-sm">
                                Tracking imunisasi sesuai jadwal yang direkomendasikan
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-[#04A3E8]/10 rounded-xl border border-[#04A3E8]/20">
                                    <div className="text-lg font-bold text-[#04A3E8]">2</div>
                                    <div className="text-xs text-[#04A3E8]">Selesai</div>
                                </div>
                                <div className="text-center p-3 bg-[#7C7D7F]/10 rounded-xl border border-[#7C7D7F]/20">
                                    <div className="text-lg font-bold text-[#7C7D7F]">1</div>
                                    <div className="text-xs text-[#7C7D7F]">Jatuh Tempo</div>
                                </div>
                                <div className="text-center p-3 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                                    <div className="text-lg font-bold text-[#163461]">1</div>
                                    <div className="text-xs text-[#163461]">Akan Datang</div>
                                </div>
                                <div className="text-center p-3 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                                    <div className="text-lg font-bold text-[#163461]">4</div>
                                    <div className="text-xs text-[#163461]">Total</div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mpasi" className="space-y-4">
                            <div className="flex items-center gap-2 text-[#163461]">
                                <Heart className="h-5 w-5 text-[#04A3E8]" />
                                <h3 className="text-lg font-semibold">Menu MPASI</h3>
                            </div>
                            <p className="text-[#7C7D7F] text-sm">
                                Riwayat makanan pendamping ASI dan reaksi bayi
                            </p>
                            <div className="space-y-3">
                                {sampleMpasiData.slice(0, 3).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                                        <div>
                                            <div className="font-medium text-[#163461]">{item.food}</div>
                                            <div className="text-sm text-[#7C7D7F]">{item.age} • {item.frequency}</div>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-lg ${item.reaction === 'Baik'
                                                ? 'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20'
                                                : 'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20'
                                            }`}>
                                            {item.reaction}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Table Demo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Activity className="h-5 w-5 text-[#04A3E8]" />
                        Demo Table Components
                    </CardTitle>
                    <CardDescription>
                        Table dengan responsive behavior untuk mobile dan desktop
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Table */}
                    <div>
                        <h4 className="font-semibold text-[#163461] mb-3">Basic Table</h4>
                        <Table>
                            <TableCaption>Data pertumbuhan bayi dalam 3 bulan terakhir</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Usia</TableHead>
                                    <TableHead>Berat (kg)</TableHead>
                                    <TableHead>Tinggi (cm)</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sampleGrowthData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {new Date(row.date).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>{row.age}</TableCell>
                                        <TableCell>{row.weight} kg</TableCell>
                                        <TableCell>{row.height} cm</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${row.status === 'normal'
                                                    ? 'bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20'
                                                    : 'bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20'
                                                }`}>
                                                {row.status === 'normal' ? 'Normal' : 'Perhatian'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Responsive Growth Table */}
                    <div>
                        <h4 className="font-semibold text-[#163461] mb-3">Responsive Growth Table</h4>
                        <GrowthTable growthData={sampleGrowthData} />
                    </div>

                    {/* Responsive Immunization Table */}
                    <div>
                        <h4 className="font-semibold text-[#163461] mb-3">Responsive Immunization Table</h4>
                        <ImmunizationTable immunizationData={sampleImmunizationData} />
                    </div>
                </CardContent>
            </Card>

            {/* Accordion Demo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Users className="h-5 w-5 text-[#04A3E8]" />
                        Demo Accordion Component
                    </CardTitle>
                    <CardDescription>
                        Accordion dengan keyboard navigation dan BayiCare styling
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="growth-info">
                            <AccordionTrigger className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-[#04A3E8]" />
                                Informasi Pertumbuhan
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-[#7C7D7F]">
                                        Pertumbuhan bayi diukur berdasarkan standar WHO yang mencakup
                                        berat badan, tinggi badan, dan lingkar kepala.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="h-4 w-4 text-[#04A3E8]" />
                                                <span className="font-medium text-[#163461]">Normal</span>
                                            </div>
                                            <p className="text-sm text-[#7C7D7F]">
                                                Pertumbuhan sesuai dengan kurva standar WHO
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="h-4 w-4 text-[#7C7D7F]" />
                                                <span className="font-medium text-[#163461]">Perhatian</span>
                                            </div>
                                            <p className="text-sm text-[#7C7D7F]">
                                                Pertumbuhan perlu dipantau lebih ketat
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="immunization-schedule">
                            <AccordionTrigger className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#04A3E8]" />
                                Jadwal Imunisasi
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-[#7C7D7F]">
                                        Jadwal imunisasi mengikuti rekomendasi IDAI (Ikatan Dokter Anak Indonesia)
                                        untuk memberikan perlindungan optimal bagi bayi.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div>
                                                <div className="font-medium text-[#163461]">BCG</div>
                                                <div className="text-sm text-[#7C7D7F]">Lahir - 2 bulan</div>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded-lg bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20">
                                                Selesai
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div>
                                                <div className="font-medium text-[#163461]">DPT 1</div>
                                                <div className="text-sm text-[#7C7D7F]">2 bulan</div>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded-lg bg-[#04A3E8]/10 text-[#04A3E8] border border-[#04A3E8]/20">
                                                Selesai
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div>
                                                <div className="font-medium text-[#163461]">DPT 2</div>
                                                <div className="text-sm text-[#7C7D7F]">4 bulan</div>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded-lg bg-[#7C7D7F]/10 text-[#7C7D7F] border border-[#7C7D7F]/20">
                                                Jatuh Tempo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="mpasi-guide">
                            <AccordionTrigger className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-[#04A3E8]" />
                                Panduan MPASI
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-[#7C7D7F]">
                                        MPASI (Makanan Pendamping ASI) diberikan mulai usia 6 bulan
                                        dengan memperhatikan tekstur, nutrisi, dan reaksi bayi.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-2">6 Bulan</div>
                                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                                <li>• Bubur halus</li>
                                                <li>• Puree buah</li>
                                                <li>• Sayuran kukus</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-2">8 Bulan</div>
                                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                                <li>• Makanan cincang</li>
                                                <li>• Finger food</li>
                                                <li>• Protein hewani</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-2">12 Bulan</div>
                                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                                <li>• Makanan keluarga</li>
                                                <li>• Tekstur normal</li>
                                                <li>• Variasi lengkap</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="tips-care">
                            <AccordionTrigger className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-[#04A3E8]" />
                                Tips Perawatan Bayi
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-[#7C7D7F]">
                                        Tips praktis untuk perawatan bayi sehari-hari yang dapat membantu
                                        pertumbuhan dan perkembangan optimal.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-1">Pola Tidur</div>
                                            <p className="text-sm text-[#7C7D7F]">
                                                Bayi membutuhkan 14-17 jam tidur per hari. Ciptakan rutinitas
                                                tidur yang konsisten.
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-1">Stimulasi</div>
                                            <p className="text-sm text-[#7C7D7F]">
                                                Berikan stimulasi sesuai usia melalui permainan, musik,
                                                dan interaksi sosial.
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[#F1F5FC] rounded-lg border border-[#EEF3FC]">
                                            <div className="font-medium text-[#163461] mb-1">Kebersihan</div>
                                            <p className="text-sm text-[#7C7D7F]">
                                                Jaga kebersihan bayi dan lingkungan untuk mencegah infeksi
                                                dan penyakit.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            {/* Accessibility and Responsive Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#163461]">
                        <Clock className="h-5 w-5 text-[#04A3E8]" />
                        Fitur Accessibility & Responsive
                    </CardTitle>
                    <CardDescription>
                        Fitur-fitur khusus untuk aksesibilitas dan responsive design
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">Table Features</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• Responsive card view pada mobile</li>
                                <li>• Horizontal scroll untuk data banyak</li>
                                <li>• Caption untuk screen readers</li>
                                <li>• Proper table semantics</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">Tabs Features</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• Keyboard navigation (Arrow keys)</li>
                                <li>• Touch-friendly pada mobile</li>
                                <li>• ARIA labels dan roles</li>
                                <li>• Smooth animations</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">Accordion Features</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• Keyboard navigation (Space/Enter)</li>
                                <li>• Proper ARIA expanded states</li>
                                <li>• Smooth expand/collapse</li>
                                <li>• Touch targets 44px minimum</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-[#F1F5FC] rounded-xl border border-[#EEF3FC]">
                            <h4 className="font-semibold text-[#163461] mb-2">General Features</h4>
                            <ul className="text-sm text-[#7C7D7F] space-y-1">
                                <li>• Reduced motion support</li>
                                <li>• High contrast compatibility</li>
                                <li>• Indonesian language support</li>
                                <li>• BayiCare color palette</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}