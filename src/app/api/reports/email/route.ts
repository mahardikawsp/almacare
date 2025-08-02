import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { recipients, subject, message, childId, reportType, filename } = body

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return NextResponse.json(
                { error: 'Recipients are required' },
                { status: 400 }
            )
        }

        if (!childId || !reportType) {
            return NextResponse.json(
                { error: 'Child ID and report type are required' },
                { status: 400 }
            )
        }

        // In a real implementation, you would:
        // 1. Generate the PDF report
        // 2. Send email with the PDF attachment
        // 3. Use a service like SendGrid, AWS SES, or Nodemailer

        // For now, we'll simulate the email sending
        console.log('Email report request:', {
            recipients,
            subject: subject || `Laporan Kesehatan Anak - ${filename}`,
            message: message || 'Terlampir laporan kesehatan anak Anda.',
            childId,
            reportType,
            filename
        })

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        return NextResponse.json({
            success: true,
            message: 'Laporan berhasil dikirim via email',
            sentTo: recipients,
            reportType,
            filename
        })

    } catch (error) {
        console.error('Error sending email report:', error)
        return NextResponse.json(
            { error: 'Failed to send email report' },
            { status: 500 }
        )
    }
}