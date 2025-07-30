/**
 * WHO Z-score Calculator
 * Implements the LMS method for calculating Z-scores based on WHO Child Growth Standards
 */

import {
    WHOStandardPoint,
    WEIGHT_FOR_AGE_BOYS,
    WEIGHT_FOR_AGE_GIRLS,
    HEIGHT_FOR_AGE_BOYS,
    HEIGHT_FOR_AGE_GIRLS,
    WEIGHT_FOR_HEIGHT_BOYS,
    WEIGHT_FOR_HEIGHT_GIRLS,
    HEAD_CIRCUMFERENCE_FOR_AGE_BOYS,
    HEAD_CIRCUMFERENCE_FOR_AGE_GIRLS
} from './who-standards-data'
import { Gender } from '@prisma/client'

export interface ZScoreResult {
    zScore: number
    percentile: number
    status: 'normal' | 'warning' | 'alert'
    message: string
}

export interface GrowthIndicatorResult {
    weightForAge: ZScoreResult
    heightForAge: ZScoreResult
    weightForHeight: ZScoreResult
    headCircumferenceForAge?: ZScoreResult
}

/**
 * Calculate age in months from birth date
 */
export function calculateAgeInMonths(birthDate: Date, measurementDate: Date = new Date()): number {
    const birth = new Date(birthDate)
    const measurement = new Date(measurementDate)

    const yearDiff = measurement.getFullYear() - birth.getFullYear()
    const monthDiff = measurement.getMonth() - birth.getMonth()
    const dayDiff = measurement.getDate() - birth.getDate()

    let totalMonths = yearDiff * 12 + monthDiff

    // Adjust for partial months
    if (dayDiff < 0) {
        totalMonths -= 1
    }

    return Math.max(0, totalMonths)
}

/**
 * Interpolate LMS values for a given age
 */
function interpolateLMS(ageInMonths: number, standards: WHOStandardPoint[]): WHOStandardPoint {
    // Find the closest age points
    const exactMatch = standards.find(point => point.ageInMonths === ageInMonths)
    if (exactMatch) {
        return exactMatch
    }

    // Find surrounding points for interpolation
    let lowerPoint: WHOStandardPoint | null = null
    let upperPoint: WHOStandardPoint | null = null

    for (let i = 0; i < standards.length - 1; i++) {
        if (standards[i].ageInMonths <= ageInMonths && standards[i + 1].ageInMonths >= ageInMonths) {
            lowerPoint = standards[i]
            upperPoint = standards[i + 1]
            break
        }
    }

    // If age is outside the range, use the closest endpoint
    if (!lowerPoint || !upperPoint) {
        if (ageInMonths < standards[0].ageInMonths) {
            return standards[0]
        } else {
            return standards[standards.length - 1]
        }
    }

    // Linear interpolation
    const ageDiff = upperPoint.ageInMonths - lowerPoint.ageInMonths
    const ageRatio = (ageInMonths - lowerPoint.ageInMonths) / ageDiff

    return {
        ageInMonths,
        L: lowerPoint.L + (upperPoint.L - lowerPoint.L) * ageRatio,
        M: lowerPoint.M + (upperPoint.M - lowerPoint.M) * ageRatio,
        S: lowerPoint.S + (upperPoint.S - lowerPoint.S) * ageRatio
    }
}

/**
 * Calculate Z-score using the LMS method
 * Formula: Z = ((value/M)^L - 1) / (L * S)
 * Special case: If L = 0, Z = ln(value/M) / S
 */
function calculateZScore(value: number, L: number, M: number, S: number): number {
    if (value <= 0 || M <= 0 || S <= 0) {
        throw new Error('Invalid measurement values')
    }

    let zScore: number

    if (Math.abs(L) < 0.01) {
        // L is approximately 0, use logarithmic formula
        zScore = Math.log(value / M) / S
    } else {
        // Standard LMS formula
        zScore = (Math.pow(value / M, L) - 1) / (L * S)
    }

    // Clamp extreme values
    return Math.max(-5, Math.min(5, zScore))
}

/**
 * Convert Z-score to percentile
 */
function zScoreToPercentile(zScore: number): number {
    // Approximation using the cumulative distribution function
    // This is a simplified version - for production, consider using a more accurate implementation
    const t = 1 / (1 + 0.2316419 * Math.abs(zScore))
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2)
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

    if (zScore > 0) {
        prob = 1 - prob
    }

    return Math.round(prob * 100 * 100) / 100 // Round to 2 decimal places
}

/**
 * Determine growth status based on Z-score
 */
function getGrowthStatus(zScore: number, indicator: string): { status: 'normal' | 'warning' | 'alert', message: string } {
    if (zScore < -3) {
        return {
            status: 'alert',
            message: `${indicator} sangat rendah (Z-score: ${zScore.toFixed(1)}). Segera konsultasi dengan dokter.`
        }
    } else if (zScore < -2) {
        return {
            status: 'alert',
            message: `${indicator} rendah (Z-score: ${zScore.toFixed(1)}). Konsultasi dengan dokter diperlukan.`
        }
    } else if (zScore < -1) {
        return {
            status: 'warning',
            message: `${indicator} sedikit di bawah normal (Z-score: ${zScore.toFixed(1)}). Pantau terus perkembangannya.`
        }
    } else if (zScore <= 1) {
        return {
            status: 'normal',
            message: `${indicator} normal (Z-score: ${zScore.toFixed(1)}).`
        }
    } else if (zScore <= 2) {
        return {
            status: 'warning',
            message: `${indicator} sedikit di atas normal (Z-score: ${zScore.toFixed(1)}). Pantau terus perkembangannya.`
        }
    } else if (zScore <= 3) {
        return {
            status: 'alert',
            message: `${indicator} tinggi (Z-score: ${zScore.toFixed(1)}). Konsultasi dengan dokter diperlukan.`
        }
    } else {
        return {
            status: 'alert',
            message: `${indicator} sangat tinggi (Z-score: ${zScore.toFixed(1)}). Segera konsultasi dengan dokter.`
        }
    }
}

/**
 * Calculate Weight-for-Age Z-score
 */
export function calculateWeightForAgeZScore(
    weight: number,
    ageInMonths: number,
    gender: Gender
): ZScoreResult {
    const standards = gender === 'MALE' ? WEIGHT_FOR_AGE_BOYS : WEIGHT_FOR_AGE_GIRLS
    const lms = interpolateLMS(ageInMonths, standards)
    const zScore = calculateZScore(weight, lms.L, lms.M, lms.S)
    const percentile = zScoreToPercentile(zScore)
    const { status, message } = getGrowthStatus(zScore, 'Berat badan menurut umur')

    return { zScore, percentile, status, message }
}

/**
 * Calculate Height-for-Age Z-score
 */
export function calculateHeightForAgeZScore(
    height: number,
    ageInMonths: number,
    gender: Gender
): ZScoreResult {
    const standards = gender === 'MALE' ? HEIGHT_FOR_AGE_BOYS : HEIGHT_FOR_AGE_GIRLS
    const lms = interpolateLMS(ageInMonths, standards)
    const zScore = calculateZScore(height, lms.L, lms.M, lms.S)
    const percentile = zScoreToPercentile(zScore)
    const { status, message } = getGrowthStatus(zScore, 'Tinggi badan menurut umur')

    return { zScore, percentile, status, message }
}

/**
 * Calculate Weight-for-Height Z-score
 */
export function calculateWeightForHeightZScore(
    weight: number,
    height: number,
    gender: Gender
): ZScoreResult {
    const standards = gender === 'MALE' ? WEIGHT_FOR_HEIGHT_BOYS : WEIGHT_FOR_HEIGHT_GIRLS

    // Find the closest height value in the standards
    const heightCm = Math.round(height)
    let closestStandard = standards[0]
    let minDiff = Math.abs(standards[0].ageInMonths - heightCm) // Using ageInMonths as height in cm

    for (const standard of standards) {
        const diff = Math.abs(standard.ageInMonths - heightCm)
        if (diff < minDiff) {
            minDiff = diff
            closestStandard = standard
        }
    }

    const zScore = calculateZScore(weight, closestStandard.L, closestStandard.M, closestStandard.S)
    const percentile = zScoreToPercentile(zScore)
    const { status, message } = getGrowthStatus(zScore, 'Berat badan menurut tinggi badan')

    return { zScore, percentile, status, message }
}

/**
 * Calculate Head Circumference-for-Age Z-score
 */
export function calculateHeadCircumferenceForAgeZScore(
    headCircumference: number,
    ageInMonths: number,
    gender: Gender
): ZScoreResult {
    const standards = gender === 'MALE' ? HEAD_CIRCUMFERENCE_FOR_AGE_BOYS : HEAD_CIRCUMFERENCE_FOR_AGE_GIRLS
    const lms = interpolateLMS(ageInMonths, standards)
    const zScore = calculateZScore(headCircumference, lms.L, lms.M, lms.S)
    const percentile = zScoreToPercentile(zScore)
    const { status, message } = getGrowthStatus(zScore, 'Lingkar kepala menurut umur')

    return { zScore, percentile, status, message }
}

/**
 * Get growth status classification based on Z-score
 */
export function getGrowthStatusClassification(zScore: number): {
    classification: 'severely_underweight' | 'underweight' | 'normal' | 'overweight' | 'obese' | 'severely_stunted' | 'stunted' | 'tall'
    color: 'red' | 'orange' | 'green' | 'yellow'
    priority: 'high' | 'medium' | 'low'
} {
    if (zScore < -3) {
        return { classification: 'severely_underweight', color: 'red', priority: 'high' }
    } else if (zScore < -2) {
        return { classification: 'underweight', color: 'orange', priority: 'medium' }
    } else if (zScore <= 1) {
        return { classification: 'normal', color: 'green', priority: 'low' }
    } else if (zScore <= 2) {
        return { classification: 'overweight', color: 'yellow', priority: 'medium' }
    } else {
        return { classification: 'obese', color: 'red', priority: 'high' }
    }
}

/**
 * Calculate BMI for age Z-score (for children over 2 years)
 */
export function calculateBMIForAge(weight: number, height: number, ageInMonths: number, gender: Gender): {
    bmi: number
    zScore?: number
    status?: 'normal' | 'warning' | 'alert'
    message?: string
} {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)

    // BMI-for-age is typically used for children 2+ years
    if (ageInMonths < 24) {
        return { bmi }
    }

    // For simplicity, we'll use weight-for-height as a proxy for BMI-for-age
    // In a full implementation, you would have separate BMI-for-age standards
    const weightForHeightResult = calculateWeightForHeightZScore(weight, height, gender)

    return {
        bmi,
        zScore: weightForHeightResult.zScore,
        status: weightForHeightResult.status,
        message: `BMI: ${bmi.toFixed(1)} kg/m². ${weightForHeightResult.message}`
    }
}

/**
 * Validate measurement values
 */
export function validateMeasurements(
    weight: number,
    height: number,
    headCircumference: number | null,
    ageInMonths: number
): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Weight validation
    if (weight <= 0 || weight > 50) {
        errors.push('Berat badan harus antara 0.1 - 50 kg')
    }

    // Height validation
    if (height <= 0 || height > 150) {
        errors.push('Tinggi badan harus antara 1 - 150 cm')
    }

    // Head circumference validation
    if (headCircumference !== null && (headCircumference <= 0 || headCircumference > 70)) {
        errors.push('Lingkar kepala harus antara 1 - 70 cm')
    }

    // Age validation
    if (ageInMonths < 0 || ageInMonths > 60) {
        errors.push('Usia harus antara 0 - 60 bulan')
    }

    // Logical validations
    if (weight > 0 && height > 0) {
        const bmi = weight / Math.pow(height / 100, 2)
        if (bmi < 5 || bmi > 40) {
            errors.push('Kombinasi berat dan tinggi badan tidak wajar (BMI terlalu ekstrem)')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Calculate all growth indicators for a child
 */
export function calculateAllGrowthIndicators(
    weight: number,
    height: number,
    headCircumference: number | null,
    ageInMonths: number,
    gender: Gender
): GrowthIndicatorResult {
    // Validate measurements first
    const validation = validateMeasurements(weight, height, headCircumference, ageInMonths)
    if (!validation.isValid) {
        throw new Error(`Invalid measurements: ${validation.errors.join(', ')}`)
    }

    const result: GrowthIndicatorResult = {
        weightForAge: calculateWeightForAgeZScore(weight, ageInMonths, gender),
        heightForAge: calculateHeightForAgeZScore(height, ageInMonths, gender),
        weightForHeight: calculateWeightForHeightZScore(weight, height, gender)
    }

    if (headCircumference !== null && headCircumference > 0) {
        result.headCircumferenceForAge = calculateHeadCircumferenceForAgeZScore(
            headCircumference,
            ageInMonths,
            gender
        )
    }

    return result
}

/**
 * Calculate growth indicators from birth date and measurement date
 */
export function calculateGrowthIndicatorsFromDates(
    weight: number,
    height: number,
    headCircumference: number | null,
    birthDate: Date,
    measurementDate: Date,
    gender: Gender
): GrowthIndicatorResult {
    const ageInMonths = calculateAgeInMonths(birthDate, measurementDate)
    return calculateAllGrowthIndicators(weight, height, headCircumference, ageInMonths, gender)
}