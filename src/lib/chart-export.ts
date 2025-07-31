import { format } from 'date-fns'

export interface ExportOptions {
    filename?: string
    format?: 'png' | 'pdf'
    quality?: number
    scale?: number
    backgroundColor?: string
}

export class ChartExportService {
    /**
     * Export chart as PNG image
     */
    static async exportAsPNG(
        elementId: string,
        options: ExportOptions = {}
    ): Promise<boolean> {
        try {
            const html2canvas = (await import('html2canvas')).default
            const element = document.getElementById(elementId)

            if (!element) {
                throw new Error(`Element with ID "${elementId}" not found`)
            }

            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                logging: false
            })

            const link = document.createElement('a')
            link.download = options.filename || `chart-${format(new Date(), 'yyyy-MM-dd-HHmm')}.png`
            link.href = canvas.toDataURL('image/png', options.quality || 0.9)
            link.click()

            return true
        } catch (error) {
            console.error('Error exporting chart as PNG:', error)
            return false
        }
    }

    /**
     * Export chart as PDF
     */
    static async exportAsPDF(
        elementId: string,
        options: ExportOptions = {}
    ): Promise<boolean> {
        try {
            const [html2canvas, jsPDF] = await Promise.all([
                import('html2canvas'),
                import('jspdf')
            ])

            const element = document.getElementById(elementId)
            if (!element) {
                throw new Error(`Element with ID "${elementId}" not found`)
            }

            const canvas = await html2canvas.default(element, {
                useCORS: true,
                allowTaint: true,
                logging: false
            })

            const imgData = canvas.toDataURL('image/png', options.quality || 0.9)
            const pdf = new jsPDF.jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = 30

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
            pdf.save(options.filename || `chart-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`)

            return true
        } catch (error) {
            console.error('Error exporting chart as PDF:', error)
            return false
        }
    }

    /**
     * Export multiple charts as a single PDF report
     */
    static async exportMultipleCharts(
        elementIds: string[],
        options: ExportOptions & { title?: string } = {}
    ): Promise<boolean> {
        try {
            const [html2canvas, jsPDF] = await Promise.all([
                import('html2canvas'),
                import('jspdf')
            ])

            const pdf = new jsPDF.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            let currentY = 20

            // Add title if provided
            if (options.title) {
                pdf.setFontSize(16)
                pdf.text(options.title, pdfWidth / 2, currentY, { align: 'center' })
                currentY += 15
            }

            for (let i = 0; i < elementIds.length; i++) {
                const element = document.getElementById(elementIds[i])
                if (!element) continue

                const canvas = await html2canvas.default(element, {
                    useCORS: true,
                    allowTaint: true,
                    logging: false
                })

                const imgData = canvas.toDataURL('image/png', options.quality || 0.8)
                const imgWidth = canvas.width
                const imgHeight = canvas.height
                const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - currentY - 20) / imgHeight)
                const scaledWidth = imgWidth * ratio
                const scaledHeight = imgHeight * ratio
                const imgX = (pdfWidth - scaledWidth) / 2

                // Add new page if needed
                if (currentY + scaledHeight > pdfHeight - 20) {
                    pdf.addPage()
                    currentY = 20
                }

                pdf.addImage(imgData, 'PNG', imgX, currentY, scaledWidth, scaledHeight)
                currentY += scaledHeight + 10
            }

            pdf.save(options.filename || `laporan-grafik-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`)
            return true
        } catch (error) {
            console.error('Error exporting multiple charts:', error)
            return false
        }
    }

    /**
     * Show export options modal
     */
    static showExportModal(
        elementId: string,
        onExport: (format: 'png' | 'pdf', options: ExportOptions) => void
    ): void {
        // Create modal HTML
        const modalHTML = `
            <div id="export-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 class="text-lg font-semibold mb-4">Ekspor Grafik</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
                            <select id="export-format" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                <option value="png">PNG (Gambar)</option>
                                <option value="pdf">PDF (Dokumen)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nama File</label>
                            <input 
                                type="text" 
                                id="export-filename" 
                                class="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="grafik-${format(new Date(), 'yyyy-MM-dd')}"
                            />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Kualitas</label>
                            <select id="export-quality" class="w-full border border-gray-300 rounded-md px-3 py-2">
                                <option value="0.6">Rendah (File kecil)</option>
                                <option value="0.8" selected>Sedang</option>
                                <option value="1.0">Tinggi (File besar)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 mt-6">
                        <button 
                            id="export-cancel" 
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button 
                            id="export-confirm" 
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Ekspor
                        </button>
                    </div>
                </div>
            </div>
        `

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML)

        // Add event listeners
        const modal = document.getElementById('export-modal')!
        const cancelBtn = document.getElementById('export-cancel')!
        const confirmBtn = document.getElementById('export-confirm')!
        const formatSelect = document.getElementById('export-format') as HTMLSelectElement
        const filenameInput = document.getElementById('export-filename') as HTMLInputElement
        const qualitySelect = document.getElementById('export-quality') as HTMLSelectElement

        const closeModal = () => {
            modal.remove()
        }

        cancelBtn.addEventListener('click', closeModal)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal()
        })

        confirmBtn.addEventListener('click', () => {
            const exportFormat = formatSelect.value as 'png' | 'pdf'
            const filename = filenameInput.value || `grafik-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`
            const quality = parseFloat(qualitySelect.value)

            onExport(exportFormat, { filename, quality })
            closeModal()
        })
    }
}

// Utility function for showing toast notifications
export function showExportNotification(success: boolean, format: string): void {
    const message = success
        ? `Grafik berhasil diekspor sebagai ${format.toUpperCase()}`
        : `Gagal mengekspor grafik. Silakan coba lagi.`

    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium ${success ? 'bg-green-500' : 'bg-red-500'
        }`
    toast.textContent = message

    document.body.appendChild(toast)

    setTimeout(() => {
        toast.remove()
    }, 3000)
}