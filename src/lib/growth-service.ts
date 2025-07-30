/**
 * Growth Service
 * Service layer for growth tracking and Z-score calculations
 */

import { prisma } from './prisma'
import {
    calculateGrowthIndicatorsFromDates,
    calculateAgeInMonths,
    GrowthIndicatorResult,
    ZScoreResult,
    getGrowthStatusClassification,
    calculateBMIForAge
} from './who-zscore-calculator'
import {
    analyzeGrowthTrend,
    calculateGrowthVelocity,
    detectGrowthFaltering,
    TrendAnalysis,
    GrowthVelocity,
    GrowthDataPoint
} from './growth-trend-analysis'
import { Child, GrowthRecord, Gender } from '@prisma/client'

export interface GrowthRecordWithAnalysis extends GrowthRecord {
    analysis: GrowthIndicatorResult
    ageInMonths: number
}

export interface GrowthTrendPoint {
    date: Date
    ageInMonths: number
    value: number
    zScore: number
    status: 'normal' | 'warning' | 'alert'
}

export interface GrowthTrend {
    indicator: 'weightForAge' | 'heightForAge' | 'weightForHeight' | 'headCircumferenceForAge'
    data: GrowthTrendPoint[]
    currentStatus: 'normal' | 'warning' | 'alert'
    trend: 'improving' | 'stable' | 'declining'
    recommendation: string
}

export interface GrowthSummary {
    latestRecord?: GrowthRecordWithAnalysis
    trends: GrowthTrend[]
    trendAnalysis: {
        weightForAge: TrendAnalysis
        heightForAge: TrendAnalysis
        weightForHeight: TrendAnalysis
        headCircumferenceForAge?: TrendAnalysis
    }
    velocityAnalysis: {
        weight: GrowthVelocity
        height: GrowthVelocity
        headCircumference?: GrowthVelocity
    }
    growthFaltering: {
        hasFaltering: boolean
        severity: 'mild' | 'moderate' | 'severe' | 'none'
        indicators: string[]
        recommendations: string[]
    }
    bmiAnalysis?: {
        bmi: number
        zScore?: number
        status?: 'normal' | 'warning' | 'alert'
        message?: string
    }
    alerts: string[]
    recommendations: string[]
}

export class GrowthService {
    /**
     * Create a new growth record with Z-score calculations
     */
    static async createGrowthRecord(
        childId: string,
        data: {
            date: Date
            weight: number
            height: number
            headCircumference?: number
        }
    ): Promise<GrowthRecordWithAnalysis> {
        // Get child information
        const child = await prisma.child.findUnique({
            where: { id: childId }
        })

        if (!child) {
            throw new Error('Child not found')
        }

        // Calculate Z-scores
        const analysis = calculateGrowthIndicatorsFromDates(
            data.weight,
            data.height,
            data.headCircumference || null,
            child.birthDate,
            data.date,
            child.gender
        )

        // Create the growth record
        const growthRecord = await prisma.growthRecord.create({
            data: {
                childId,
                date: data.date,
                weight: data.weight,
                height: data.height,
                headCircumference: data.headCircumference,
                weightForAgeZScore: analysis.weightForAge.zScore,
                heightForAgeZScore: analysis.heightForAge.zScore,
                weightForHeightZScore: analysis.weightForHeight.zScore,
                headCircumferenceZScore: analysis.headCircumferenceForAge?.zScore
            }
        })

        const ageInMonths = calculateAgeInMonths(child.birthDate, data.date)

        return {
            ...growthRecord,
            analysis,
            ageInMonths
        }
    }

    /**
     * Get all growth records for a child with analysis
     */
    static async getChildGrowthRecords(childId: string): Promise<GrowthRecordWithAnalysis[]> {
        const child = await prisma.child.findUnique({
            where: { id: childId },
            include: {
                growthRecords: {
                    orderBy: { date: 'asc' }
                }
            }
        })

        if (!child) {
            throw new Error('Child not found')
        }

        return child.growthRecords.map(record => {
            const ageInMonths = calculateAgeInMonths(child.birthDate, record.date)
            const analysis = calculateGrowthIndicatorsFromDates(
                record.weight,
                record.height,
                record.headCircumference,
                child.birthDate,
                record.date,
                child.gender
            )

            return {
                ...record,
                analysis,
                ageInMonths
            }
        })
    }

    /**
     * Get the latest growth record for a child
     */
    static async getLatestGrowthRecord(childId: string): Promise<GrowthRecordWithAnalysis | null> {
        const child = await prisma.child.findUnique({
            where: { id: childId },
            include: {
                growthRecords: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        })

        if (!child || child.growthRecords.length === 0) {
            return null
        }

        const record = child.growthRecords[0]
        const ageInMonths = calculateAgeInMonths(child.birthDate, record.date)
        const analysis = calculateGrowthIndicatorsFromDates(
            record.weight,
            record.height,
            record.headCircumference,
            child.birthDate,
            record.date,
            child.gender
        )

        return {
            ...record,
            analysis,
            ageInMonths
        }
    }

    /**
     * Calculate growth trends for a specific indicator
     */
    static calculateGrowthTrend(
        records: GrowthRecordWithAnalysis[],
        indicator: 'weightForAge' | 'heightForAge' | 'weightForHeight' | 'headCircumferenceForAge'
    ): GrowthTrend {
        const data: GrowthTrendPoint[] = records.map(record => {
            let value: number
            let zScore: number
            let status: 'normal' | 'warning' | 'alert'

            switch (indicator) {
                case 'weightForAge':
                    value = record.weight
                    zScore = record.analysis.weightForAge.zScore
                    status = record.analysis.weightForAge.status
                    break
                case 'heightForAge':
                    value = record.height
                    zScore = record.analysis.heightForAge.zScore
                    status = record.analysis.heightForAge.status
                    break
                case 'weightForHeight':
                    value = record.weight
                    zScore = record.analysis.weightForHeight.zScore
                    status = record.analysis.weightForHeight.status
                    break
                case 'headCircumferenceForAge':
                    value = record.headCircumference || 0
                    zScore = record.analysis.headCircumferenceForAge?.zScore || 0
                    status = record.analysis.headCircumferenceForAge?.status || 'normal'
                    break
            }

            return {
                date: record.date,
                ageInMonths: record.ageInMonths,
                value,
                zScore,
                status
            }
        }).filter(point => point.value > 0) // Filter out invalid measurements

        if (data.length === 0) {
            return {
                indicator,
                data: [],
                currentStatus: 'normal',
                trend: 'stable',
                recommendation: 'Belum ada data pengukuran.'
            }
        }

        const currentStatus = data[data.length - 1].status

        // Calculate trend based on Z-score changes
        let trend: 'improving' | 'stable' | 'declining' = 'stable'
        if (data.length >= 2) {
            const recentPoints = data.slice(-3) // Look at last 3 points
            const zScoreChanges = []

            for (let i = 1; i < recentPoints.length; i++) {
                zScoreChanges.push(recentPoints[i].zScore - recentPoints[i - 1].zScore)
            }

            const avgChange = zScoreChanges.reduce((sum, change) => sum + change, 0) / zScoreChanges.length

            if (avgChange > 0.1) {
                trend = 'improving'
            } else if (avgChange < -0.1) {
                trend = 'declining'
            }
        }

        // Generate recommendation
        let recommendation = ''
        switch (indicator) {
            case 'weightForAge':
                if (currentStatus === 'alert' && trend === 'declining') {
                    recommendation = 'Berat badan anak menurun. Segera konsultasi dengan dokter dan perhatikan asupan nutrisi.'
                } else if (currentStatus === 'warning') {
                    recommendation = 'Pantau berat badan anak secara rutin dan pastikan asupan nutrisi seimbang.'
                } else if (trend === 'improving') {
                    recommendation = 'Pertumbuhan berat badan menunjukkan perbaikan. Lanjutkan pola makan yang baik.'
                } else {
                    recommendation = 'Berat badan anak dalam kondisi normal. Lanjutkan pola makan sehat.'
                }
                break
            case 'heightForAge':
                if (currentStatus === 'alert') {
                    recommendation = 'Tinggi badan anak perlu perhatian khusus. Konsultasi dengan dokter untuk evaluasi lebih lanjut.'
                } else if (currentStatus === 'warning') {
                    recommendation = 'Pantau tinggi badan anak dan pastikan asupan kalsium dan protein cukup.'
                } else {
                    recommendation = 'Tinggi badan anak berkembang dengan baik. Lanjutkan pola hidup sehat.'
                }
                break
            case 'weightForHeight':
                if (currentStatus === 'alert') {
                    recommendation = 'Proporsi berat dan tinggi badan perlu perhatian. Konsultasi dengan ahli gizi.'
                } else if (currentStatus === 'warning') {
                    recommendation = 'Pantau proporsi berat dan tinggi badan anak secara rutin.'
                } else {
                    recommendation = 'Proporsi berat dan tinggi badan anak ideal. Pertahankan pola makan seimbang.'
                }
                break
            case 'headCircumferenceForAge':
                if (currentStatus === 'alert') {
                    recommendation = 'Lingkar kepala perlu evaluasi medis. Segera konsultasi dengan dokter.'
                } else if (currentStatus === 'warning') {
                    recommendation = 'Pantau perkembangan lingkar kepala anak secara rutin.'
                } else {
                    recommendation = 'Perkembangan lingkar kepala anak normal.'
                }
                break
        }

        return {
            indicator,
            data,
            currentStatus,
            trend,
            recommendation
        }
    }

    /**
     * Get comprehensive growth summary for a child
     */
    static async getGrowthSummary(childId: string): Promise<GrowthSummary> {
        const records = await this.getChildGrowthRecords(childId)
        const latestRecord = records.length > 0 ? records[records.length - 1] : undefined

        const trends: GrowthTrend[] = [
            this.calculateGrowthTrend(records, 'weightForAge'),
            this.calculateGrowthTrend(records, 'heightForAge'),
            this.calculateGrowthTrend(records, 'weightForHeight')
        ]

        // Add head circumference trend if data is available
        const hasHeadCircumferenceData = records.some(r => r.headCircumference && r.headCircumference > 0)
        if (hasHeadCircumferenceData) {
            trends.push(this.calculateGrowthTrend(records, 'headCircumferenceForAge'))
        }

        // Convert records to data points for trend analysis
        const weightDataPoints: GrowthDataPoint[] = records.map(record => ({
            date: record.date,
            ageInMonths: record.ageInMonths,
            value: record.weight,
            zScore: record.analysis.weightForAge.zScore,
            status: record.analysis.weightForAge.status
        }))

        const heightDataPoints: GrowthDataPoint[] = records.map(record => ({
            date: record.date,
            ageInMonths: record.ageInMonths,
            value: record.height,
            zScore: record.analysis.heightForAge.zScore,
            status: record.analysis.heightForAge.status
        }))

        const weightForHeightDataPoints: GrowthDataPoint[] = records.map(record => ({
            date: record.date,
            ageInMonths: record.ageInMonths,
            value: record.weight,
            zScore: record.analysis.weightForHeight.zScore,
            status: record.analysis.weightForHeight.status
        }))

        const headCircumferenceDataPoints: GrowthDataPoint[] = records
            .filter(record => record.headCircumference && record.headCircumference > 0)
            .map(record => ({
                date: record.date,
                ageInMonths: record.ageInMonths,
                value: record.headCircumference!,
                zScore: record.analysis.headCircumferenceForAge?.zScore || 0,
                status: record.analysis.headCircumferenceForAge?.status || 'normal'
            }))

        // Advanced trend analysis
        const trendAnalysis = {
            weightForAge: analyzeGrowthTrend(weightDataPoints, 'weightForAge'),
            heightForAge: analyzeGrowthTrend(heightDataPoints, 'heightForAge'),
            weightForHeight: analyzeGrowthTrend(weightForHeightDataPoints, 'weightForHeight'),
            ...(headCircumferenceDataPoints.length > 0 && {
                headCircumferenceForAge: analyzeGrowthTrend(headCircumferenceDataPoints, 'headCircumferenceForAge')
            })
        }

        // Velocity analysis
        const velocityAnalysis = {
            weight: calculateGrowthVelocity(weightDataPoints, 'weight'),
            height: calculateGrowthVelocity(heightDataPoints, 'height'),
            ...(headCircumferenceDataPoints.length > 0 && {
                headCircumference: calculateGrowthVelocity(headCircumferenceDataPoints, 'headCircumference')
            })
        }

        // Growth faltering detection
        const growthFaltering = detectGrowthFaltering(weightDataPoints, heightDataPoints)

        // BMI analysis for children over 2 years
        let bmiAnalysis
        if (latestRecord && latestRecord.ageInMonths >= 24) {
            const child = await prisma.child.findUnique({ where: { id: childId } })
            if (child) {
                bmiAnalysis = calculateBMIForAge(
                    latestRecord.weight,
                    latestRecord.height,
                    latestRecord.ageInMonths,
                    child.gender
                )
            }
        }

        // Generate alerts
        const alerts: string[] = []
        const recommendations: string[] = []

        if (latestRecord) {
            const { analysis } = latestRecord

            if (analysis.weightForAge.status === 'alert') {
                alerts.push(analysis.weightForAge.message)
            }
            if (analysis.heightForAge.status === 'alert') {
                alerts.push(analysis.heightForAge.message)
            }
            if (analysis.weightForHeight.status === 'alert') {
                alerts.push(analysis.weightForHeight.message)
            }
            if (analysis.headCircumferenceForAge?.status === 'alert') {
                alerts.push(analysis.headCircumferenceForAge.message)
            }
        }

        // Add trend-based alerts
        Object.values(trendAnalysis).forEach(trend => {
            if (trend.riskLevel === 'high') {
                alerts.push(trend.recommendation)
            }
        })

        // Add growth faltering alerts
        if (growthFaltering.hasFaltering) {
            alerts.push(`Terdeteksi gangguan pertumbuhan (${growthFaltering.severity}): ${growthFaltering.indicators.join(', ')}`)
        }

        // Add trend-based recommendations
        trends.forEach(trend => {
            if (trend.recommendation && !recommendations.includes(trend.recommendation)) {
                recommendations.push(trend.recommendation)
            }
        })

        // Add advanced analysis recommendations
        Object.values(trendAnalysis).forEach(trend => {
            if (trend.recommendation && !recommendations.includes(trend.recommendation)) {
                recommendations.push(trend.recommendation)
            }
        })

        // Add velocity recommendations
        Object.values(velocityAnalysis).forEach(velocity => {
            if (velocity.status !== 'normal' && !recommendations.includes(velocity.message)) {
                recommendations.push(velocity.message)
            }
        })

        // Add growth faltering recommendations
        growthFaltering.recommendations.forEach(rec => {
            if (!recommendations.includes(rec)) {
                recommendations.push(rec)
            }
        })

        // Add general recommendations based on age
        if (latestRecord && latestRecord.ageInMonths >= 6) {
            recommendations.push('Pastikan anak mendapat MPASI yang bergizi seimbang.')
        }

        if (records.length === 0) {
            recommendations.push('Mulai lakukan pengukuran pertumbuhan anak secara rutin.')
        } else if (records.length === 1) {
            recommendations.push('Lakukan pengukuran pertumbuhan secara rutin untuk memantau perkembangan anak.')
        }

        return {
            latestRecord,
            trends,
            trendAnalysis,
            velocityAnalysis,
            growthFaltering,
            bmiAnalysis,
            alerts,
            recommendations
        }
    }

    /**
     * Update an existing growth record
     */
    static async updateGrowthRecord(
        recordId: string,
        data: {
            date?: Date
            weight?: number
            height?: number
            headCircumference?: number
        }
    ): Promise<GrowthRecordWithAnalysis> {
        const existingRecord = await prisma.growthRecord.findUnique({
            where: { id: recordId },
            include: { child: true }
        })

        if (!existingRecord) {
            throw new Error('Growth record not found')
        }

        const updatedData = {
            date: data.date || existingRecord.date,
            weight: data.weight || existingRecord.weight,
            height: data.height || existingRecord.height,
            headCircumference: data.headCircumference !== undefined ? data.headCircumference : existingRecord.headCircumference
        }

        // Recalculate Z-scores
        const analysis = calculateGrowthIndicatorsFromDates(
            updatedData.weight,
            updatedData.height,
            updatedData.headCircumference,
            existingRecord.child.birthDate,
            updatedData.date,
            existingRecord.child.gender
        )

        const updatedRecord = await prisma.growthRecord.update({
            where: { id: recordId },
            data: {
                ...updatedData,
                weightForAgeZScore: analysis.weightForAge.zScore,
                heightForAgeZScore: analysis.heightForAge.zScore,
                weightForHeightZScore: analysis.weightForHeight.zScore,
                headCircumferenceZScore: analysis.headCircumferenceForAge?.zScore
            }
        })

        const ageInMonths = calculateAgeInMonths(existingRecord.child.birthDate, updatedData.date)

        return {
            ...updatedRecord,
            analysis,
            ageInMonths
        }
    }

    /**
     * Delete a growth record
     */
    static async deleteGrowthRecord(recordId: string): Promise<void> {
        await prisma.growthRecord.delete({
            where: { id: recordId }
        })
    }

    /**
     * Check if a child needs growth monitoring reminder
     */
    static async checkGrowthMonitoringReminder(childId: string): Promise<{
        needsReminder: boolean
        daysSinceLastMeasurement?: number
        message?: string
    }> {
        const latestRecord = await this.getLatestGrowthRecord(childId)

        if (!latestRecord) {
            return {
                needsReminder: true,
                message: 'Belum ada data pengukuran. Mulai lakukan pengukuran pertumbuhan anak.'
            }
        }

        const daysSinceLastMeasurement = Math.floor(
            (new Date().getTime() - latestRecord.date.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Recommend measurement every 30 days for children under 2 years
        // Every 60 days for children 2-5 years
        const recommendedInterval = latestRecord.ageInMonths < 24 ? 30 : 60

        if (daysSinceLastMeasurement >= recommendedInterval) {
            return {
                needsReminder: true,
                daysSinceLastMeasurement,
                message: `Sudah ${daysSinceLastMeasurement} hari sejak pengukuran terakhir. Saatnya mengukur pertumbuhan anak lagi.`
            }
        }

        return {
            needsReminder: false,
            daysSinceLastMeasurement
        }
    }
}