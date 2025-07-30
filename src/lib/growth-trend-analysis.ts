/**
 * Growth Trend Analysis
 * Advanced analysis functions for growth patterns and trends
 */

import { ZScoreResult } from './who-zscore-calculator'

export interface GrowthDataPoint {
    date: Date
    ageInMonths: number
    value: number
    zScore: number
    status: 'normal' | 'warning' | 'alert'
}

export interface TrendAnalysis {
    direction: 'improving' | 'stable' | 'declining' | 'fluctuating'
    velocity: number // Rate of change per month
    acceleration: number // Change in velocity
    consistency: number // 0-1, how consistent the trend is
    significance: 'high' | 'medium' | 'low' // Statistical significance
    recommendation: string
    riskLevel: 'low' | 'medium' | 'high'
}

export interface GrowthVelocity {
    indicator: 'weight' | 'height' | 'headCircumference'
    velocity: number // Units per month
    expectedVelocity: number
    percentileVelocity: number
    status: 'normal' | 'slow' | 'fast'
    message: string
}

/**
 * Calculate linear regression for trend analysis
 */
function calculateLinearRegression(points: { x: number; y: number }[]): {
    slope: number
    intercept: number
    rSquared: number
} {
    if (points.length < 2) {
        return { slope: 0, intercept: 0, rSquared: 0 }
    }

    const n = points.length
    const sumX = points.reduce((sum, p) => sum + p.x, 0)
    const sumY = points.reduce((sum, p) => sum + p.y, 0)
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0)
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0)
    const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Calculate R-squared
    const meanY = sumY / n
    const totalSumSquares = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0)
    const residualSumSquares = points.reduce((sum, p) => {
        const predicted = slope * p.x + intercept
        return sum + Math.pow(p.y - predicted, 2)
    }, 0)

    const rSquared = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares)

    return { slope, intercept, rSquared }
}

/**
 * Analyze growth trend from data points
 */
export function analyzeGrowthTrend(
    dataPoints: GrowthDataPoint[],
    indicator: 'weightForAge' | 'heightForAge' | 'weightForHeight' | 'headCircumferenceForAge'
): TrendAnalysis {
    if (dataPoints.length < 2) {
        return {
            direction: 'stable',
            velocity: 0,
            acceleration: 0,
            consistency: 0,
            significance: 'low',
            recommendation: 'Perlu lebih banyak data untuk analisis trend.',
            riskLevel: 'low'
        }
    }

    // Sort by age
    const sortedPoints = [...dataPoints].sort((a, b) => a.ageInMonths - b.ageInMonths)

    // Calculate trend using Z-scores (more meaningful than raw values)
    const zScorePoints = sortedPoints.map(point => ({
        x: point.ageInMonths,
        y: point.zScore
    }))

    const regression = calculateLinearRegression(zScorePoints)
    const velocity = regression.slope // Z-score change per month
    const consistency = Math.max(0, regression.rSquared) // How well the trend fits

    // Calculate acceleration (change in velocity)
    let acceleration = 0
    if (sortedPoints.length >= 3) {
        const midPoint = Math.floor(sortedPoints.length / 2)
        const firstHalf = zScorePoints.slice(0, midPoint + 1)
        const secondHalf = zScorePoints.slice(midPoint)

        const firstRegression = calculateLinearRegression(firstHalf)
        const secondRegression = calculateLinearRegression(secondHalf)

        acceleration = secondRegression.slope - firstRegression.slope
    }

    // Determine direction
    let direction: TrendAnalysis['direction']
    if (Math.abs(velocity) < 0.05) {
        direction = 'stable'
    } else if (Math.abs(acceleration) > 0.1) {
        direction = 'fluctuating'
    } else if (velocity > 0) {
        direction = 'improving'
    } else {
        direction = 'declining'
    }

    // Determine significance
    let significance: TrendAnalysis['significance']
    if (consistency > 0.7 && Math.abs(velocity) > 0.1) {
        significance = 'high'
    } else if (consistency > 0.4 && Math.abs(velocity) > 0.05) {
        significance = 'medium'
    } else {
        significance = 'low'
    }

    // Assess risk level
    const latestZScore = sortedPoints[sortedPoints.length - 1].zScore
    let riskLevel: TrendAnalysis['riskLevel']

    if (latestZScore < -2 || latestZScore > 2) {
        riskLevel = 'high'
    } else if ((latestZScore < -1 || latestZScore > 1) && direction === 'declining') {
        riskLevel = 'medium'
    } else {
        riskLevel = 'low'
    }

    // Generate recommendation
    const recommendation = generateTrendRecommendation(
        indicator,
        direction,
        velocity,
        latestZScore,
        riskLevel,
        significance
    )

    return {
        direction,
        velocity,
        acceleration,
        consistency,
        significance,
        recommendation,
        riskLevel
    }
}

/**
 * Generate trend-based recommendations
 */
function generateTrendRecommendation(
    indicator: string,
    direction: TrendAnalysis['direction'],
    velocity: number,
    latestZScore: number,
    riskLevel: TrendAnalysis['riskLevel'],
    significance: TrendAnalysis['significance']
): string {
    const indicatorNames = {
        weightForAge: 'berat badan',
        heightForAge: 'tinggi badan',
        weightForHeight: 'proporsi berat-tinggi',
        headCircumferenceForAge: 'lingkar kepala'
    }

    const indicatorName = indicatorNames[indicator as keyof typeof indicatorNames] || indicator

    if (riskLevel === 'high') {
        if (direction === 'declining') {
            return `${indicatorName} menunjukkan penurunan yang mengkhawatirkan. Segera konsultasi dengan dokter untuk evaluasi dan intervensi.`
        } else {
            return `${indicatorName} berada di luar rentang normal. Konsultasi dengan dokter diperlukan untuk evaluasi lebih lanjut.`
        }
    }

    if (direction === 'declining' && significance === 'high') {
        return `${indicatorName} menunjukkan tren penurunan yang konsisten. Perhatikan asupan nutrisi dan konsultasi dengan tenaga kesehatan.`
    }

    if (direction === 'improving') {
        return `${indicatorName} menunjukkan perbaikan yang baik. Lanjutkan pola asuh dan nutrisi yang sudah diterapkan.`
    }

    if (direction === 'fluctuating') {
        return `${indicatorName} menunjukkan fluktuasi. Pastikan konsistensi dalam pengukuran dan pola asuh anak.`
    }

    if (direction === 'stable' && latestZScore >= -1 && latestZScore <= 1) {
        return `${indicatorName} stabil dalam rentang normal. Pertahankan pola asuh dan nutrisi yang baik.`
    }

    return `Pantau terus perkembangan ${indicatorName} anak secara rutin.`
}

/**
 * Calculate growth velocity
 */
export function calculateGrowthVelocity(
    dataPoints: GrowthDataPoint[],
    indicator: 'weight' | 'height' | 'headCircumference'
): GrowthVelocity {
    if (dataPoints.length < 2) {
        return {
            indicator,
            velocity: 0,
            expectedVelocity: 0,
            percentileVelocity: 0,
            status: 'normal',
            message: 'Perlu minimal 2 data untuk menghitung kecepatan pertumbuhan.'
        }
    }

    const sortedPoints = [...dataPoints].sort((a, b) => a.ageInMonths - b.ageInMonths)
    const firstPoint = sortedPoints[0]
    const lastPoint = sortedPoints[sortedPoints.length - 1]

    const timeDiff = lastPoint.ageInMonths - firstPoint.ageInMonths
    const valueDiff = lastPoint.value - firstPoint.value

    const velocity = timeDiff > 0 ? valueDiff / timeDiff : 0

    // Expected velocity ranges (approximate values)
    const expectedVelocities = {
        weight: getExpectedWeightVelocity(lastPoint.ageInMonths),
        height: getExpectedHeightVelocity(lastPoint.ageInMonths),
        headCircumference: getExpectedHeadCircumferenceVelocity(lastPoint.ageInMonths)
    }

    const expectedVelocity = expectedVelocities[indicator]
    const percentileVelocity = expectedVelocity > 0 ? (velocity / expectedVelocity) * 100 : 0

    let status: GrowthVelocity['status']
    if (percentileVelocity < 70) {
        status = 'slow'
    } else if (percentileVelocity > 130) {
        status = 'fast'
    } else {
        status = 'normal'
    }

    const message = generateVelocityMessage(indicator, velocity, status, percentileVelocity)

    return {
        indicator,
        velocity,
        expectedVelocity,
        percentileVelocity,
        status,
        message
    }
}

/**
 * Get expected weight velocity by age
 */
function getExpectedWeightVelocity(ageInMonths: number): number {
    if (ageInMonths < 3) return 0.8 // kg/month
    if (ageInMonths < 6) return 0.6
    if (ageInMonths < 12) return 0.4
    if (ageInMonths < 24) return 0.25
    return 0.15
}

/**
 * Get expected height velocity by age
 */
function getExpectedHeightVelocity(ageInMonths: number): number {
    if (ageInMonths < 3) return 3.5 // cm/month
    if (ageInMonths < 6) return 2.0
    if (ageInMonths < 12) return 1.5
    if (ageInMonths < 24) return 1.0
    return 0.8
}

/**
 * Get expected head circumference velocity by age
 */
function getExpectedHeadCircumferenceVelocity(ageInMonths: number): number {
    if (ageInMonths < 3) return 2.0 // cm/month
    if (ageInMonths < 6) return 1.0
    if (ageInMonths < 12) return 0.5
    if (ageInMonths < 24) return 0.25
    return 0.1
}

/**
 * Generate velocity message
 */
function generateVelocityMessage(
    indicator: 'weight' | 'height' | 'headCircumference',
    velocity: number,
    status: GrowthVelocity['status'],
    percentileVelocity: number
): string {
    const indicatorNames = {
        weight: 'berat badan',
        height: 'tinggi badan',
        headCircumference: 'lingkar kepala'
    }

    const units = {
        weight: 'kg/bulan',
        height: 'cm/bulan',
        headCircumference: 'cm/bulan'
    }

    const indicatorName = indicatorNames[indicator]
    const unit = units[indicator]

    const velocityText = `${velocity.toFixed(2)} ${unit}`
    const percentileText = `${percentileVelocity.toFixed(0)}%`

    switch (status) {
        case 'slow':
            return `Kecepatan pertumbuhan ${indicatorName} lambat (${velocityText}, ${percentileText} dari normal). Perhatikan asupan nutrisi.`
        case 'fast':
            return `Kecepatan pertumbuhan ${indicatorName} cepat (${velocityText}, ${percentileText} dari normal). Pantau terus perkembangannya.`
        default:
            return `Kecepatan pertumbuhan ${indicatorName} normal (${velocityText}, ${percentileText} dari normal).`
    }
}

/**
 * Detect growth faltering (failure to thrive)
 */
export function detectGrowthFaltering(
    weightData: GrowthDataPoint[],
    heightData: GrowthDataPoint[]
): {
    hasFaltering: boolean
    severity: 'mild' | 'moderate' | 'severe' | 'none'
    indicators: string[]
    recommendations: string[]
} {
    const indicators: string[] = []
    const recommendations: string[] = []

    // Check weight trend
    const weightTrend = analyzeGrowthTrend(weightData, 'weightForAge')
    if (weightTrend.direction === 'declining' && weightTrend.significance === 'high') {
        indicators.push('Penurunan berat badan yang konsisten')
    }

    // Check height trend
    const heightTrend = analyzeGrowthTrend(heightData, 'heightForAge')
    if (heightTrend.direction === 'declining' && heightTrend.significance === 'high') {
        indicators.push('Penurunan tinggi badan yang konsisten')
    }

    // Check latest Z-scores
    if (weightData.length > 0) {
        const latestWeight = weightData[weightData.length - 1]
        if (latestWeight.zScore < -2) {
            indicators.push('Berat badan di bawah -2 SD')
        }
    }

    if (heightData.length > 0) {
        const latestHeight = heightData[heightData.length - 1]
        if (latestHeight.zScore < -2) {
            indicators.push('Tinggi badan di bawah -2 SD')
        }
    }

    // Determine severity
    let severity: 'mild' | 'moderate' | 'severe' | 'none' = 'none'
    const hasFaltering = indicators.length > 0

    if (hasFaltering) {
        const hasMultipleIndicators = indicators.length >= 2
        const hasSevereZScore = weightData.some(d => d.zScore < -3) || heightData.some(d => d.zScore < -3)

        if (hasSevereZScore) {
            severity = 'severe'
            recommendations.push('Segera konsultasi dengan dokter spesialis anak')
            recommendations.push('Evaluasi medis menyeluruh diperlukan')
        } else if (hasMultipleIndicators) {
            severity = 'moderate'
            recommendations.push('Konsultasi dengan dokter dalam waktu dekat')
            recommendations.push('Evaluasi pola makan dan asupan nutrisi')
        } else {
            severity = 'mild'
            recommendations.push('Pantau pertumbuhan lebih ketat')
            recommendations.push('Perhatikan asupan nutrisi dan pola makan')
        }

        recommendations.push('Lakukan pengukuran pertumbuhan lebih sering')
        recommendations.push('Dokumentasikan asupan makanan harian')
    }

    return {
        hasFaltering,
        severity,
        indicators,
        recommendations
    }
}