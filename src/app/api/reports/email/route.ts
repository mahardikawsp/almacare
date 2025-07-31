import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface EmailReportRequest {
    recipients: string[]
    subject: string
    message: string
    childId: string
    reportType: 'comprehensive' | 'growth' | 'immunization'
    filename: string
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body: EmailReportRequest = await request.json()
        const { recipients, subject, message, childId, reportType, filename } = body

        // Validate input
        if (!recipients || recipients.length === 0) {
            return NextResponse.json(
                { error: 'Recipients are required' },
                { status: 400 }
            )
        }

        if (!childId || !reportType || !filename) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify child belongs to user
        const child = await prisma.child.findFirst({
            where: {
                id: childId,
                userId: session.user.id
            }
        })

        if (!child) {
            return NextResponse.json(
                { error: 'Child not found' },
                { status: 404 }
            )
        }

        // Validate email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const invalidEmails = recipients.filter(email => !emailRegex.test(email))

        if (invalidEmails.length > 0) {
            return NextResponse.json(
                { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
                { status: 400 }
            )
        }

        // In a real implementation, you would:
        // 1. Generate the PDF report
        // 2. Store it temporarily or in cloud storage
        // 3. Send email with attachment using a service like SendGrid, AWS SES, etc.

        // For now, we'll simulate the email sending process
        const emailResult = await sendReportEmail({
            recipients,
            subject,
            message,
            child: {
                id: child.id,
                name: child.name,
                birthDate: child.birthDate.toISOString(),
                gender: child.gender
            },
            reportType,
            filename,
            senderName: session.user.name || 'BayiCare User'
        })

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            )
        }

        // Log the email activity (commented out for now)
        // await logEmailActivity({
        //     userId: session.user.id,
        //     childId,
        //     recipients,
        //     reportType,
        //     filename
        // })

        return NextResponse.json({
            success: true,
            message: 'Report sent successfully',
            sentTo: recipients.length
        })

    } catch (error) {
        console.error('Error sending report email:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

async function sendReportEmail({
    recipients,
    subject,
    message,
    child,
    reportType,
    filename,
    senderName
}: {
    recipients: string[]
    subject: string
    message: string
    child: { id: string; name: string; birthDate: string; gender: string }
    reportType: string
    filename: string
    senderName: string
}) {
    try {
        // In a real implementation, you would use an email service like:
        // - SendGrid
        // - AWS SES
        // - Nodemailer with SMTP
        // - Resend
        // - etc.

        // Example with a hypothetical email service:
        /*
        const emailService = new EmailService({
            apiKey: process.env.EMAIL_API_KEY
        })

        const emailTemplate = generateEmailTemplate({
            message,
            child,
            reportType,
            senderName
        })

        for (const recipient of recipients) {
            await emailService.send({
                to: recipient,
                subject,
                html: emailTemplate,
                attachments: [{
                    filename,
                    content: pdfBuffer, // Generated PDF buffer
                    contentType: 'application/pdf'
                }]
            })
        }
        */

        // For demo purposes, we'll simulate success
        console.log(`Simulating email send to: ${recipients.join(', ')}`)
        console.log(`Subject: ${subject}`)
        console.log(`Message: ${message}`)
        console.log(`Child: ${child.name}`)
        console.log(`Report type: ${reportType}`)
        console.log(`Filename: ${filename}`)
        console.log(`Sender: ${senderName}`)

        return { success: true }

    } catch (error) {
        console.error('Email sending error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// Note: generateEmailTemplate and logEmailActivity functions would be used
// in a real implementation with actual email service integration