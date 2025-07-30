import { prisma } from './prisma'
import { ImmunizationStatus } from '@prisma/client'

/**
 * Generate immunization records for a child based on master schedule
 */
export async function generateChildImmunizationRecords(childId: string, birthDate: Date) {
    try {
        // Get all active immunization schedules
        const schedules = await prisma.immunizationSchedule.findMany({
            where: { isActive: true },
            orderBy: [
                { ageInMonths: 'asc' },
                { sortOrder: 'asc' }
            ]
        })

        // Generate records for each schedule
        const records = schedules.map(schedule => {
            const scheduledDate = new Date(birthDate)
            scheduledDate.setMonth(scheduledDate.getMonth() + schedule.ageInMonths)

            return {
                childId,
                scheduleId: schedule.id,
                scheduledDate,
                status: 'SCHEDULED' as ImmunizationStatus
            }
        })

        // Create all records at once, skip duplicates
        const result = await prisma.immunizationRecord.createMany({
            data: records,
            skipDuplicates: true
        })

        return result
    } catch (error) {
        console.error('Error generating child immunization records:', error)
        throw new Error('Failed to generate immunization records')
    }
}

/**
 * Get immunization records for a child with schedule details
 */
export async function getChildImmunizationRecords(childId: string) {
    try {
        const records = await prisma.immunizationRecord.findMany({
            where: { childId },
            include: {
                schedule: true
            },
            orderBy: [
                { scheduledDate: 'asc' }
            ]
        })

        return records
    } catch (error) {
        console.error('Error fetching child immunization records:', error)
        throw new Error('Failed to fetch immunization records')
    }
}

/**
 * Update immunization record status
 */
export async function updateImmunizationRecord(
    recordId: string,
    data: {
        status: ImmunizationStatus
        actualDate?: Date
        notes?: string
    }
) {
    try {
        const record = await prisma.immunizationRecord.update({
            where: { id: recordId },
            data,
            include: {
                schedule: true,
                child: true
            }
        })

        return record
    } catch (error) {
        console.error('Error updating immunization record:', error)
        throw new Error('Failed to update immunization record')
    }
}

/**
 * Get upcoming immunizations (within next 30 days)
 */
export async function getUpcomingImmunizations(childId: string) {
    try {
        const today = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)

        const records = await prisma.immunizationRecord.findMany({
            where: {
                childId,
                status: 'SCHEDULED',
                scheduledDate: {
                    gte: today,
                    lte: thirtyDaysFromNow
                }
            },
            include: {
                schedule: true
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        })

        return records
    } catch (error) {
        console.error('Error fetching upcoming immunizations:', error)
        throw new Error('Failed to fetch upcoming immunizations')
    }
}

/**
 * Get overdue immunizations
 */
export async function getOverdueImmunizations(childId: string) {
    try {
        const today = new Date()

        // First, update overdue records
        await prisma.immunizationRecord.updateMany({
            where: {
                childId,
                status: 'SCHEDULED',
                scheduledDate: {
                    lt: today
                }
            },
            data: {
                status: 'OVERDUE'
            }
        })

        // Then fetch overdue records
        const records = await prisma.immunizationRecord.findMany({
            where: {
                childId,
                status: 'OVERDUE'
            },
            include: {
                schedule: true
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        })

        return records
    } catch (error) {
        console.error('Error fetching overdue immunizations:', error)
        throw new Error('Failed to fetch overdue immunizations')
    }
}

/**
 * Get immunization calendar data for a child
 */
export async function getImmunizationCalendar(childId: string, year?: number, month?: number) {
    try {
        let dateFilter = {}

        if (year && month) {
            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0)
            dateFilter = {
                scheduledDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        } else if (year) {
            const startDate = new Date(year, 0, 1)
            const endDate = new Date(year, 11, 31)
            dateFilter = {
                scheduledDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        }

        const records = await prisma.immunizationRecord.findMany({
            where: {
                childId,
                ...dateFilter
            },
            include: {
                schedule: true
            },
            orderBy: {
                scheduledDate: 'asc'
            }
        })

        // Transform to calendar format
        const calendarItems = records.map(record => {
            const today = new Date()
            const isOverdue = record.status === 'SCHEDULED' && record.scheduledDate < today

            return {
                id: record.id,
                vaccineName: record.schedule.vaccineName,
                vaccineType: record.schedule.vaccineType,
                scheduledDate: record.scheduledDate,
                actualDate: record.actualDate,
                status: isOverdue ? 'OVERDUE' as ImmunizationStatus : record.status,
                notes: record.notes,
                isOptional: record.schedule.isOptional,
                isOverdue,
                description: record.schedule.description
            }
        })

        return calendarItems
    } catch (error) {
        console.error('Error fetching immunization calendar:', error)
        throw new Error('Failed to fetch immunization calendar')
    }
}

/**
 * Get immunization statistics for a child
 */
export async function getImmunizationStats(childId: string) {
    try {
        const stats = await prisma.immunizationRecord.groupBy({
            by: ['status'],
            where: { childId },
            _count: {
                status: true
            }
        })

        const result = {
            total: 0,
            completed: 0,
            scheduled: 0,
            overdue: 0,
            skipped: 0
        }

        stats.forEach(stat => {
            result.total += stat._count.status
            switch (stat.status) {
                case 'COMPLETED':
                    result.completed = stat._count.status
                    break
                case 'SCHEDULED':
                    result.scheduled = stat._count.status
                    break
                case 'OVERDUE':
                    result.overdue = stat._count.status
                    break
                case 'SKIPPED':
                    result.skipped = stat._count.status
                    break
            }
        })

        return result
    } catch (error) {
        console.error('Error fetching immunization stats:', error)
        throw new Error('Failed to fetch immunization statistics')
    }
}

// Legacy class export for backward compatibility
export const ImmunizationService = {
    generateChildImmunizationRecords,
    getChildImmunizationRecords,
    updateImmunizationRecord,
    getUpcomingImmunizations,
    getOverdueImmunizations,
    getImmunizationCalendar,
    getImmunizationStats
}