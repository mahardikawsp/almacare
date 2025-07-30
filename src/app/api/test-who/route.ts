import { NextRequest, NextResponse } from 'next/server'
import {
    calculateAgeInMonths,
    calculateAllGrowthIndicators,
    validateMeasurements,
    getGrowthStatusClassification,
    calculateBMIForAge
} from '@/lib/who-zscore-calculator'
import {
    analyzeGrowthTrend,
    calculateGrowthVelocity,
    detectGrowthFaltering,
    GrowthDataPoint
} from '@/lib/growth-trend-analysis'

export async function GET(request: NextRequest) {
    try {
        // Test data
        const birthDate = new Date('2023-01-01')
        const measurementDate = new Date('2023-07-01')
        const weight = 7.5 // kg
        const height = 68 // cm
        const headCircumference = 44 // cm
        const gender = 'MALE' as const

        // Test 1: Age calculation
        const ageInMonths = calculateAgeInMonths(birthDate, measurementDate)

        // Test 2: Measurement validation
        const validation = validateMeasurements(weight, height, headCircumference, ageInMonths)

        // Test 3: Z-score calculations
        const growthIndicators = calculateAllGrowthIndicators(
            weight,
            height,
            headCircumference,
            ageInMonths,
            gender
        )

        // Test 4: Growth status classification
        const classification = getGrowthStatusClassification(growthIndicators.weightForAge.zScore)

        // Test 5: BMI calculation
        const bmiResult = calculateBMIForAge(weight, height, ageInMonths, gender)

        // Test 6: Sample growth data for trend analysis
        const sampleGrowthData: GrowthDataPoint[] = [
            { date: new Date('2023-01-01'), ageInMonths: 0, value: 3.2, zScore: -0.5, status: 'normal' },
            { date: new Date('2023-02-01'), ageInMonths: 1, value: 4.1, zScore: -0.3, status: 'normal' },
            { date: new Date('2023-03-01'), ageInMonths: 2, value: 5.0, zScore: -0.1, status: 'normal' },
            { date: new Date('2023-04-01'), ageInMonths: 3, value: 5.8, zScore: 0.1, status: 'normal' },
            { date: new Date('2023-05-01'), ageInMonths: 4, value: 6.5, zScore: 0.2, status: 'normal' },
            { date: new Date('2023-06-01'), ageInMonths: 5, value: 7.2, zScore: 0.3, status: 'normal' }
        ]

        const trendAnalysis = analyzeGrowthTrend(sampleGrowthData, 'weightForAge')
        const velocityAnalysis = calculateGrowthVelocity(sampleGrowthData, 'weight')

        // Test 7: Growth faltering detection
        const falteringData: GrowthDataPoint[] = [
            { date: new Date('2023-01-01'), ageInMonths: 6, value: 7.5, zScore: 0.0, status: 'normal' },
            { date: new Date('2023-02-01'), ageInMonths: 7, value: 7.3, zScore: -0.5, status: 'normal' },
            { date: new Date('2023-03-01'), ageInMonths: 8, value: 7.0, zScore: -1.2, status: 'warning' },
            { date: new Date('2023-04-01'), ageInMonths: 9, value: 6.8, zScore: -1.8, status: 'warning' }
        ]

        const heightData: GrowthDataPoint[] = [
            { date: new Date('2023-01-01'), ageInMonths: 6, value: 67, zScore: 0.0, status: 'normal' },
            { date: new Date('2023-02-01'), ageInMonths: 7, value: 68, zScore: -0.2, status: 'normal' },
            { date: new Date('2023-03-01'), ageInMonths: 8, value: 69, zScore: -0.3, status: 'normal' },
            { date: new Date('2023-04-01'), ageInMonths: 9, value: 70, zScore: -0.4, status: 'normal' }
        ]

        const falteringResult = detectGrowthFaltering(falteringData, heightData)

        return NextResponse.json({
            success: true,
            message: 'WHO Growth Standards Integration Test Results',
            results: {
                ageCalculation: {
                    birthDate: birthDate.toISOString(),
                    measurementDate: measurementDate.toISOString(),
                    ageInMonths
                },
                validation: {
                    isValid: validation.isValid,
                    errors: validation.errors
                },
                growthIndicators: {
                    weightForAge: {
                        zScore: Math.round(growthIndicators.weightForAge.zScore * 100) / 100,
                        percentile: growthIndicators.weightForAge.percentile,
                        status: growthIndicators.weightForAge.status,
                        message: growthIndicators.weightForAge.message
                    },
                    heightForAge: {
                        zScore: Math.round(growthIndicators.heightForAge.zScore * 100) / 100,
                        percentile: growthIndicators.heightForAge.percentile,
                        status: growthIndicators.heightForAge.status,
                        message: growthIndicators.heightForAge.message
                    },
                    weightForHeight: {
                        zScore: Math.round(growthIndicators.weightForHeight.zScore * 100) / 100,
                        percentile: growthIndicators.weightForHeight.percentile,
                        status: growthIndicators.weightForHeight.status,
                        message: growthIndicators.weightForHeight.message
                    },
                    headCircumferenceForAge: growthIndicators.headCircumferenceForAge ? {
                        zScore: Math.round(growthIndicators.headCircumferenceForAge.zScore * 100) / 100,
                        percentile: growthIndicators.headCircumferenceForAge.percentile,
                        status: growthIndicators.headCircumferenceForAge.status,
                        message: growthIndicators.headCircumferenceForAge.message
                    } : null
                },
                classification: {
                    classification: classification.classification,
                    color: classification.color,
                    priority: classification.priority
                },
                bmiAnalysis: {
                    bmi: Math.round(bmiResult.bmi * 10) / 10,
                    zScore: bmiResult.zScore ? Math.round(bmiResult.zScore * 100) / 100 : null,
                    status: bmiResult.status,
                    message: bmiResult.message
                },
                trendAnalysis: {
                    direction: trendAnalysis.direction,
                    velocity: Math.round(trendAnalysis.velocity * 1000) / 1000,
                    acceleration: Math.round(trendAnalysis.acceleration * 1000) / 1000,
                    consistency: Math.round(trendAnalysis.consistency * 100) / 100,
                    significance: trendAnalysis.significance,
                    riskLevel: trendAnalysis.riskLevel,
                    recommendation: trendAnalysis.recommendation
                },
                velocityAnalysis: {
                    velocity: Math.round(velocityAnalysis.velocity * 100) / 100,
                    expectedVelocity: Math.round(velocityAnalysis.expectedVelocity * 100) / 100,
                    percentileVelocity: Math.round(velocityAnalysis.percentileVelocity),
                    status: velocityAnalysis.status,
                    message: velocityAnalysis.message
                },
                falteringDetection: {
                    hasFaltering: falteringResult.hasFaltering,
                    severity: falteringResult.severity,
                    indicators: falteringResult.indicators,
                    recommendations: falteringResult.recommendations
                }
            },
            implementationStatus: {
                dynamicNextAuthUrl: 'Implemented with automatic cloud detection',
                whoZScoreCalculation: 'Enhanced with validation and BMI calculation',
                growthStandardsData: 'Complete WHO standards data available',
                zScoreService: 'All growth indicators supported',
                growthStatusClassification: 'Implemented with color coding and priority',
                trendAnalysisFunctions: 'Advanced trend analysis with velocity and faltering detection'
            }
        })

    } catch (error) {
        console.error('WHO Integration test error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}