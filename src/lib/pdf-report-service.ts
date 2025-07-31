import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { format, differenceInMonths, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'
import type {
    GrowthRecord,
    ImmunizationRecordWithSchedule,
    GrowthAnalysis,
    NutritionSummary
} from '@/types'

interface ChildData {
    id: string
    name: string
    gender: 'MALE' | 'FEMALE'
    birthDate: Date
    relationship: string
    userId?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface PDFReportOptions {
    filename?: string
    includeCharts?: boolean
    includeGrowthData?: boolean
    includeImmunizationData?: boolean
    includeMPASIData?: boolean
    dateRange?: {
        start: Date
        end: Date
    }
    logoUrl?: string
    clinicName?: string
    doctorName?: string
}

export interface GrowthReportData {
    child: ChildData
    records: (GrowthRecord & { analysis: GrowthAnalysis })[]
    latestRecord?: GrowthRecord & { analysis: GrowthAnalysis }
    growthTrend?: {
        weight: 'increasing' | 'decreasing' | 'stable'
        height: 'increasing' | 'decreasing' | 'stable'
        weightForHeight: 'improving' | 'declining' | 'stable'
    }
}

export interface ImmunizationReportData {
    child: ChildData
    records: ImmunizationRecordWithSchedule[]
    completionRate: number
    overdueVaccines: ImmunizationRecordWithSchedule[]
    upcomingVaccines: ImmunizationRecordWithSchedule[]
}

export interface ComprehensiveReportData {
    child: ChildData
    growth: GrowthReportData
    immunization: ImmunizationReportData
    mpasi?: {
        favorites: Array<{ recipe?: { name?: string } }>
        nutritionSummary: NutritionSummary
    }
    generatedAt: Date
    reportPeriod: {
        start: Date
        end: Date
    }
}

export class PDFReportService {
    private static readonly PAGE_WIDTH = 210 // A4 width in mm
    private static readonly PAGE_HEIGHT = 297 // A4 height in mm
    private static readonly MARGIN = 20
    private static readonly CONTENT_WIDTH = this.PAGE_WIDTH - (this.MARGIN * 2)

    /**
     * Generate comprehensive child health report
     */
    static async generateComprehensiveReport(
        data: ComprehensiveReportData,
        options: PDFReportOptions = {}
    ): Promise<boolean> {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            let currentY = this.MARGIN

            // Add header
            currentY = await this.addReportHeader(pdf, data, currentY, options)

            // Add child information
            currentY = this.addChildInformation(pdf, data.child, currentY)

            // Add growth summary
            if (options.includeGrowthData !== false) {
                currentY = await this.addGrowthSummary(pdf, data.growth, currentY)
            }

            // Add immunization summary
            if (options.includeImmunizationData !== false) {
                currentY = await this.addImmunizationSummary(pdf, data.immunization, currentY)
            }

            // Add MPASI summary if available
            if (data.mpasi && options.includeMPASIData !== false) {
                currentY = await this.addMPASISummary(pdf, data.mpasi, currentY)
            }

            // Add charts if requested
            if (options.includeCharts) {
                await this.addChartsToReport(pdf, data.child.id)
            }

            // Add footer
            this.addReportFooter(pdf, data.generatedAt)

            // Save the PDF
            const filename = options.filename ||
                `laporan-kesehatan-${data.child.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`

            pdf.save(filename)
            return true

        } catch (error) {
            console.error('Error generating comprehensive report:', error)
            return false
        }
    }

    /**
     * Generate growth-specific report
     */
    static async generateGrowthReport(
        data: GrowthReportData,
        options: PDFReportOptions = {}
    ): Promise<boolean> {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            let currentY = this.MARGIN

            // Add header
            currentY = await this.addReportHeader(pdf, { child: data.child, generatedAt: new Date() }, currentY, {
                ...options,
                title: 'Laporan Pertumbuhan'
            })

            // Add child information
            currentY = this.addChildInformation(pdf, data.child, currentY)

            // Add detailed growth analysis
            currentY = await this.addDetailedGrowthAnalysis(pdf, data, currentY)

            // Add growth chart if requested
            if (options.includeCharts) {
                // Chart integration would be implemented here
                // currentY = await this.addGrowthChart(pdf, data.child.id, currentY)
            }

            // Add recommendations
            currentY = this.addGrowthRecommendations(pdf, data, currentY)

            // Add footer
            this.addReportFooter(pdf, new Date())

            // Save the PDF
            const filename = options.filename ||
                `laporan-pertumbuhan-${data.child.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`

            pdf.save(filename)
            return true

        } catch (error) {
            console.error('Error generating growth report:', error)
            return false
        }
    }

    /**
     * Generate immunization certificate/record
     */
    static async generateImmunizationCertificate(
        data: ImmunizationReportData,
        options: PDFReportOptions = {}
    ): Promise<boolean> {
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            let currentY = this.MARGIN

            // Add certificate header
            currentY = await this.addCertificateHeader(pdf, data.child, currentY, options)

            // Add immunization table
            currentY = await this.addImmunizationTable(pdf, data.records, currentY)

            // Add completion summary
            currentY = await this.addImmunizationSummary(pdf, data, currentY)

            // Add certificate footer
            this.addCertificateFooter(pdf, options)

            // Save the PDF
            const filename = options.filename ||
                `sertifikat-imunisasi-${data.child.name.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`

            pdf.save(filename)
            return true

        } catch (error) {
            console.error('Error generating immunization certificate:', error)
            return false
        }
    }

    /**
     * Add report header with logo and title
     */
    private static async addReportHeader(
        pdf: jsPDF,
        data: { child: ChildData; generatedAt: Date },
        currentY: number,
        options: PDFReportOptions & { title?: string } = {}
    ): Promise<number> {
        // Add logo if provided
        if (options.logoUrl) {
            try {
                // In a real implementation, you would load and add the logo
                // pdf.addImage(logoData, 'PNG', this.MARGIN, currentY, 30, 30)
                currentY += 35
            } catch (error) {
                console.warn('Could not load logo:', error)
            }
        }

        // Add title
        pdf.setFontSize(20)
        pdf.setFont('helvetica', 'bold')
        const title = options.title || 'Laporan Kesehatan Anak'
        pdf.text(title, this.PAGE_WIDTH / 2, currentY, { align: 'center' })
        currentY += 15

        // Add clinic/doctor info if provided
        if (options.clinicName || options.doctorName) {
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')
            if (options.clinicName) {
                pdf.text(options.clinicName, this.PAGE_WIDTH / 2, currentY, { align: 'center' })
                currentY += 6
            }
            if (options.doctorName) {
                pdf.text(`Dr. ${options.doctorName}`, this.PAGE_WIDTH / 2, currentY, { align: 'center' })
                currentY += 6
            }
        }

        // Add generation date
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'italic')
        pdf.text(
            `Dibuat pada: ${format(data.generatedAt, 'dd MMMM yyyy, HH:mm', { locale: id })}`,
            this.PAGE_WIDTH / 2,
            currentY,
            { align: 'center' }
        )
        currentY += 15

        // Add separator line
        pdf.setLineWidth(0.5)
        pdf.line(this.MARGIN, currentY, this.PAGE_WIDTH - this.MARGIN, currentY)
        currentY += 10

        return currentY
    }

    /**
     * Add child information section
     */
    private static addChildInformation(pdf: jsPDF, child: ChildData, currentY: number): number {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Informasi Anak', this.MARGIN, currentY)
        currentY += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        const birthDate = new Date(child.birthDate)
        const ageInMonths = differenceInMonths(new Date(), birthDate)
        const ageYears = Math.floor(ageInMonths / 12)
        const remainingMonths = ageInMonths % 12

        const childInfo = [
            ['Nama', child.name],
            ['Jenis Kelamin', child.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'],
            ['Tanggal Lahir', format(birthDate, 'dd MMMM yyyy', { locale: id })],
            ['Usia', `${ageYears} tahun ${remainingMonths} bulan`],
            ['Hubungan', child.relationship]
        ]

        childInfo.forEach(([label, value]) => {
            pdf.text(`${label}:`, this.MARGIN, currentY)
            pdf.text(value, this.MARGIN + 40, currentY)
            currentY += 6
        })

        currentY += 10
        return currentY
    }

    /**
     * Add growth summary section
     */
    private static async addGrowthSummary(
        pdf: jsPDF,
        data: GrowthReportData,
        currentY: number
    ): Promise<number> {
        // Check if we need a new page
        if (currentY > this.PAGE_HEIGHT - 80) {
            pdf.addPage()
            currentY = this.MARGIN
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Ringkasan Pertumbuhan', this.MARGIN, currentY)
        currentY += 10

        if (!data.latestRecord) {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'italic')
            pdf.text('Belum ada data pertumbuhan yang tercatat.', this.MARGIN, currentY)
            return currentY + 15
        }

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        // Latest measurements
        const latest = data.latestRecord
        pdf.text('Pengukuran Terakhir:', this.MARGIN, currentY)
        currentY += 8

        const measurements = [
            ['Tanggal', format(new Date(latest.date), 'dd MMMM yyyy', { locale: id })],
            ['Berat Badan', `${latest.weight} kg`],
            ['Tinggi Badan', `${latest.height} cm`],
            ['Lingkar Kepala', latest.headCircumference ? `${latest.headCircumference} cm` : 'Tidak diukur']
        ]

        measurements.forEach(([label, value]) => {
            pdf.text(`  ${label}:`, this.MARGIN, currentY)
            pdf.text(value, this.MARGIN + 50, currentY)
            currentY += 6
        })

        currentY += 5

        // Growth status
        pdf.text('Status Pertumbuhan:', this.MARGIN, currentY)
        currentY += 8

        const analysis = latest.analysis
        const statusItems = [
            ['BB/U (Berat/Usia)', analysis.weightForAge.status, analysis.weightForAge.zScore],
            ['TB/U (Tinggi/Usia)', analysis.heightForAge.status, analysis.heightForAge.zScore],
            ['BB/TB (Berat/Tinggi)', analysis.weightForHeight.status, analysis.weightForHeight.zScore]
        ]

        statusItems.forEach(([indicator, status, zScore]) => {
            const statusText = this.getStatusText(status as string)
            const color = this.getStatusColor(status as string)

            pdf.text(`  ${indicator}:`, this.MARGIN, currentY)
            pdf.text(`${statusText} (Z-Score: ${Number(zScore).toFixed(2)})`, this.MARGIN + 50, currentY)
            currentY += 6
        })

        currentY += 10
        return currentY
    }

    /**
     * Add immunization summary section
     */
    private static async addImmunizationSummary(
        pdf: jsPDF,
        data: ImmunizationReportData,
        currentY: number
    ): Promise<number> {
        // Check if we need a new page
        if (currentY > this.PAGE_HEIGHT - 80) {
            pdf.addPage()
            currentY = this.MARGIN
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Ringkasan Imunisasi', this.MARGIN, currentY)
        currentY += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        // Completion statistics
        const totalVaccines = data.records.length
        const completedVaccines = data.records.filter(r => r.status === 'COMPLETED').length
        const overdueCount = data.overdueVaccines.length
        const upcomingCount = data.upcomingVaccines.length

        const stats = [
            ['Total Vaksin', totalVaccines.toString()],
            ['Selesai', `${completedVaccines} (${data.completionRate.toFixed(1)}%)`],
            ['Terlambat', overdueCount.toString()],
            ['Akan Datang', upcomingCount.toString()]
        ]

        stats.forEach(([label, value]) => {
            pdf.text(`${label}:`, this.MARGIN, currentY)
            pdf.text(value, this.MARGIN + 40, currentY)
            currentY += 6
        })

        // Overdue vaccines alert
        if (overdueCount > 0) {
            currentY += 5
            pdf.setFont('helvetica', 'bold')
            pdf.text('⚠️ Vaksin Terlambat:', this.MARGIN, currentY)
            currentY += 6

            pdf.setFont('helvetica', 'normal')
            data.overdueVaccines.slice(0, 5).forEach(vaccine => {
                const daysPast = differenceInDays(new Date(), new Date(vaccine.scheduledDate))
                pdf.text(
                    `  • ${vaccine.schedule.vaccineName} (${daysPast} hari terlambat)`,
                    this.MARGIN,
                    currentY
                )
                currentY += 5
            })
        }

        currentY += 10
        return currentY
    }

    /**
     * Add MPASI summary section
     */
    private static async addMPASISummary(
        pdf: jsPDF,
        data: { favorites: Array<{ recipe?: { name?: string } }>; nutritionSummary: NutritionSummary },
        currentY: number
    ): Promise<number> {
        // Check if we need a new page
        if (currentY > this.PAGE_HEIGHT - 60) {
            pdf.addPage()
            currentY = this.MARGIN
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Ringkasan MPASI', this.MARGIN, currentY)
        currentY += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        // Nutrition summary
        const nutrition = data.nutritionSummary
        pdf.text('Ringkasan Gizi Harian:', this.MARGIN, currentY)
        currentY += 8

        const nutritionData = [
            ['Kalori', `${nutrition.daily.calories} / ${nutrition.recommended.calories} kkal (${nutrition.percentage.calories.toFixed(1)}%)`],
            ['Protein', `${nutrition.daily.protein} / ${nutrition.recommended.protein} g (${nutrition.percentage.protein.toFixed(1)}%)`],
            ['Lemak', `${nutrition.daily.fat} / ${nutrition.recommended.fat} g (${nutrition.percentage.fat.toFixed(1)}%)`],
            ['Karbohidrat', `${nutrition.daily.carbohydrates} / ${nutrition.recommended.carbohydrates} g (${nutrition.percentage.carbohydrates.toFixed(1)}%)`]
        ]

        nutritionData.forEach(([label, value]) => {
            pdf.text(`  ${label}:`, this.MARGIN, currentY)
            pdf.text(value, this.MARGIN + 35, currentY)
            currentY += 6
        })

        // Favorite recipes
        if (data.favorites.length > 0) {
            currentY += 5
            pdf.text('Resep Favorit:', this.MARGIN, currentY)
            currentY += 6

            data.favorites.slice(0, 5).forEach(favorite => {
                pdf.text(`  • ${favorite.recipe?.name || 'Resep tidak diketahui'}`, this.MARGIN, currentY)
                currentY += 5
            })
        }

        currentY += 10
        return currentY
    }

    /**
     * Add charts to report by capturing DOM elements
     */
    private static async addChartsToReport(pdf: jsPDF, childId: string): Promise<void> {
        try {
            // Add new page for charts
            pdf.addPage()
            let currentY = this.MARGIN

            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Grafik Pertumbuhan', this.PAGE_WIDTH / 2, currentY, { align: 'center' })
            currentY += 20

            // Capture growth chart if it exists
            const growthChartElement = document.getElementById('growth-chart-container')
            if (growthChartElement) {
                const canvas = await html2canvas(growthChartElement, {
                    useCORS: true,
                    allowTaint: true,
                    logging: false
                })

                const imgData = canvas.toDataURL('image/png', 0.8)
                const imgWidth = this.CONTENT_WIDTH
                const imgHeight = (canvas.height * imgWidth) / canvas.width

                // Check if image fits on current page
                if (currentY + imgHeight > this.PAGE_HEIGHT - this.MARGIN) {
                    pdf.addPage()
                    currentY = this.MARGIN
                }

                pdf.addImage(imgData, 'PNG', this.MARGIN, currentY, imgWidth, imgHeight)
                currentY += imgHeight + 10
            }

            // Capture immunization timeline if it exists
            const timelineElement = document.getElementById('immunization-timeline-container')
            if (timelineElement) {
                const canvas = await html2canvas(timelineElement, {
                    useCORS: true,
                    allowTaint: true,
                    logging: false
                })

                const imgData = canvas.toDataURL('image/png', 0.8)
                const imgWidth = this.CONTENT_WIDTH
                const imgHeight = (canvas.height * imgWidth) / canvas.width

                // Check if image fits on current page
                if (currentY + imgHeight > this.PAGE_HEIGHT - this.MARGIN) {
                    pdf.addPage()
                    currentY = this.MARGIN + 20

                    pdf.setFontSize(16)
                    pdf.setFont('helvetica', 'bold')
                    pdf.text('Timeline Imunisasi', this.PAGE_WIDTH / 2, this.MARGIN, { align: 'center' })
                }

                pdf.addImage(imgData, 'PNG', this.MARGIN, currentY, imgWidth, imgHeight)
            }

        } catch (error) {
            console.error('Error adding charts to report:', error)
        }
    }

    /**
     * Add detailed growth analysis
     */
    private static async addDetailedGrowthAnalysis(
        pdf: jsPDF,
        data: GrowthReportData,
        currentY: number
    ): Promise<number> {
        if (data.records.length === 0) {
            return currentY
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Analisis Pertumbuhan Detail', this.MARGIN, currentY)
        currentY += 10

        // Growth trend analysis
        if (data.growthTrend) {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'normal')
            pdf.text('Tren Pertumbuhan:', this.MARGIN, currentY)
            currentY += 8

            const trends = [
                ['Berat Badan', this.getTrendText(data.growthTrend.weight)],
                ['Tinggi Badan', this.getTrendText(data.growthTrend.height)],
                ['Status Gizi', this.getTrendText(data.growthTrend.weightForHeight)]
            ]

            trends.forEach(([indicator, trend]) => {
                pdf.text(`  ${indicator}:`, this.MARGIN, currentY)
                pdf.text(trend, this.MARGIN + 40, currentY)
                currentY += 6
            })
        }

        currentY += 10
        return currentY
    }

    /**
     * Add growth recommendations
     */
    private static addGrowthRecommendations(
        pdf: jsPDF,
        data: GrowthReportData,
        currentY: number
    ): number {
        if (!data.latestRecord) {
            return currentY
        }

        // Check if we need a new page
        if (currentY > this.PAGE_HEIGHT - 80) {
            pdf.addPage()
            currentY = this.MARGIN
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Rekomendasi', this.MARGIN, currentY)
        currentY += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        const analysis = data.latestRecord.analysis
        const recommendations: string[] = []

        // Generate recommendations based on growth status
        if (analysis.weightForAge.status === 'alert') {
            if (analysis.weightForAge.zScore < -2) {
                recommendations.push('Konsultasi dengan dokter anak untuk evaluasi gizi kurang')
                recommendations.push('Tingkatkan asupan kalori dan protein dalam makanan')
            } else {
                recommendations.push('Konsultasi dengan dokter anak untuk evaluasi kelebihan berat badan')
                recommendations.push('Atur pola makan yang seimbang dan aktivitas fisik')
            }
        }

        if (analysis.heightForAge.status === 'alert') {
            recommendations.push('Konsultasi dengan dokter anak untuk evaluasi pertumbuhan tinggi badan')
            recommendations.push('Pastikan asupan kalsium dan vitamin D yang cukup')
        }

        if (analysis.weightForHeight.status === 'alert') {
            recommendations.push('Konsultasi dengan ahli gizi untuk penyesuaian pola makan')
        }

        // Default recommendations
        if (recommendations.length === 0) {
            recommendations.push('Pertahankan pola makan yang seimbang dan bergizi')
            recommendations.push('Lakukan pemeriksaan pertumbuhan rutin setiap bulan')
            recommendations.push('Pastikan anak mendapat istirahat yang cukup')
        }

        recommendations.forEach((rec, index) => {
            pdf.text(`${index + 1}. ${rec}`, this.MARGIN, currentY)
            currentY += 8
        })

        currentY += 10
        return currentY
    }

    /**
     * Add immunization table
     */
    private static async addImmunizationTable(
        pdf: jsPDF,
        records: ImmunizationRecordWithSchedule[],
        currentY: number
    ): Promise<number> {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Riwayat Imunisasi', this.MARGIN, currentY)
        currentY += 10

        // Table headers
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')

        const headers = ['Vaksin', 'Usia', 'Terjadwal', 'Diberikan', 'Status']
        const colWidths = [40, 20, 30, 30, 25]
        let startX = this.MARGIN

        headers.forEach((header, index) => {
            pdf.text(header, startX, currentY)
            startX += colWidths[index]
        })

        currentY += 8

        // Table rows
        pdf.setFont('helvetica', 'normal')

        records.forEach(record => {
            if (currentY > this.PAGE_HEIGHT - 30) {
                pdf.addPage()
                currentY = this.MARGIN
            }

            startX = this.MARGIN
            const rowData = [
                record.schedule.vaccineName,
                `${record.schedule.ageInMonths}m`,
                format(new Date(record.scheduledDate), 'dd/MM/yy'),
                record.actualDate ? format(new Date(record.actualDate), 'dd/MM/yy') : '-',
                this.getImmunizationStatusText(record.status)
            ]

            rowData.forEach((data, index) => {
                pdf.text(data, startX, currentY)
                startX += colWidths[index]
            })

            currentY += 6
        })

        currentY += 10
        return currentY
    }

    /**
     * Add certificate header
     */
    private static async addCertificateHeader(
        pdf: jsPDF,
        child: ChildData,
        currentY: number,
        options: PDFReportOptions
    ): Promise<number> {
        // Certificate title
        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        pdf.text('SERTIFIKAT IMUNISASI', this.PAGE_WIDTH / 2, currentY, { align: 'center' })
        currentY += 20

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Diberikan kepada:', this.PAGE_WIDTH / 2, currentY, { align: 'center' })
        currentY += 15

        pdf.setFontSize(20)
        pdf.setFont('helvetica', 'bold')
        pdf.text(child.name.toUpperCase(), this.PAGE_WIDTH / 2, currentY, { align: 'center' })
        currentY += 15

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        const birthDate = format(new Date(child.birthDate), 'dd MMMM yyyy', { locale: id })
        pdf.text(`Lahir pada: ${birthDate}`, this.PAGE_WIDTH / 2, currentY, { align: 'center' })
        currentY += 20

        return currentY
    }

    /**
     * Add certificate footer
     */
    private static addCertificateFooter(pdf: jsPDF, options: PDFReportOptions): void {
        const footerY = this.PAGE_HEIGHT - 40

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')

        if (options.clinicName) {
            pdf.text(options.clinicName, this.PAGE_WIDTH - this.MARGIN, footerY, { align: 'right' })
        }

        if (options.doctorName) {
            pdf.text(`Dr. ${options.doctorName}`, this.PAGE_WIDTH - this.MARGIN, footerY + 15, { align: 'right' })
        }

        pdf.text(
            format(new Date(), 'dd MMMM yyyy', { locale: id }),
            this.PAGE_WIDTH - this.MARGIN,
            footerY + 25,
            { align: 'right' }
        )
    }

    /**
     * Add report footer
     */
    private static addReportFooter(pdf: jsPDF, generatedAt: Date): void {
        const footerY = this.PAGE_HEIGHT - 20

        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'italic')
        pdf.text(
            `Laporan dibuat oleh BayiCare pada ${format(generatedAt, 'dd MMMM yyyy, HH:mm', { locale: id })}`,
            this.PAGE_WIDTH / 2,
            footerY,
            { align: 'center' }
        )
    }

    /**
     * Helper methods
     */
    private static getStatusText(status: string): string {
        switch (status) {
            case 'normal': return 'Normal'
            case 'warning': return 'Perhatian'
            case 'alert': return 'Waspada'
            default: return 'Tidak diketahui'
        }
    }

    private static getStatusColor(status: string): string {
        switch (status) {
            case 'normal': return '#10b981'
            case 'warning': return '#f59e0b'
            case 'alert': return '#ef4444'
            default: return '#6b7280'
        }
    }

    private static getTrendText(trend: string): string {
        switch (trend) {
            case 'increasing': return 'Meningkat'
            case 'decreasing': return 'Menurun'
            case 'stable': return 'Stabil'
            case 'improving': return 'Membaik'
            case 'declining': return 'Memburuk'
            default: return 'Tidak diketahui'
        }
    }

    private static getImmunizationStatusText(status: string): string {
        switch (status) {
            case 'COMPLETED': return 'Selesai'
            case 'SCHEDULED': return 'Terjadwal'
            case 'OVERDUE': return 'Terlambat'
            case 'SKIPPED': return 'Dilewati'
            default: return 'Tidak diketahui'
        }
    }
}