/**
 * WHO Growth Standards Data
 * Based on WHO Child Growth Standards (2006) for children 0-60 months
 * Data includes L, M, S parameters for calculating Z-scores using LMS method
 */

export interface WHOStandardPoint {
    ageInMonths: number
    L: number // Lambda (skewness)
    M: number // Mu (median)
    S: number // Sigma (coefficient of variation)
}

// Weight-for-age standards (0-60 months)
export const WEIGHT_FOR_AGE_BOYS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
    { ageInMonths: 1, L: 0.2784, M: 4.4709, S: 0.13395 },
    { ageInMonths: 2, L: 0.2581, M: 5.5675, S: 0.12385 },
    { ageInMonths: 3, L: 0.2551, M: 6.3762, S: 0.11727 },
    { ageInMonths: 4, L: 0.2565, M: 7.0023, S: 0.11316 },
    { ageInMonths: 5, L: 0.2592, M: 7.5105, S: 0.11080 },
    { ageInMonths: 6, L: 0.2618, M: 7.9340, S: 0.10958 },
    { ageInMonths: 7, L: 0.2641, M: 8.2970, S: 0.10902 },
    { ageInMonths: 8, L: 0.2661, M: 8.6151, S: 0.10882 },
    { ageInMonths: 9, L: 0.2679, M: 8.9014, S: 0.10881 },
    { ageInMonths: 10, L: 0.2695, M: 9.1649, S: 0.10891 },
    { ageInMonths: 11, L: 0.2709, M: 9.4122, S: 0.10906 },
    { ageInMonths: 12, L: 0.2721, M: 9.6479, S: 0.10925 },
    { ageInMonths: 15, L: 0.2751, M: 10.3002, S: 0.10976 },
    { ageInMonths: 18, L: 0.2776, M: 10.9302, S: 0.11035 },
    { ageInMonths: 21, L: 0.2797, M: 11.5420, S: 0.11101 },
    { ageInMonths: 24, L: 0.2815, M: 12.1373, S: 0.11172 },
    { ageInMonths: 30, L: 0.2842, M: 13.2673, S: 0.11327 },
    { ageInMonths: 36, L: 0.2861, M: 14.3312, S: 0.11499 },
    { ageInMonths: 42, L: 0.2875, M: 15.3462, S: 0.11686 },
    { ageInMonths: 48, L: 0.2885, M: 16.3224, S: 0.11884 },
    { ageInMonths: 54, L: 0.2893, M: 17.2688, S: 0.12091 },
    { ageInMonths: 60, L: 0.2900, M: 18.1927, S: 0.12303 }
]

export const WEIGHT_FOR_AGE_GIRLS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
    { ageInMonths: 1, L: 0.1714, M: 4.1873, S: 0.13724 },
    { ageInMonths: 2, L: 0.0962, M: 5.1282, S: 0.13000 },
    { ageInMonths: 3, L: 0.0402, M: 5.8458, S: 0.12619 },
    { ageInMonths: 4, L: -0.0050, M: 6.4237, S: 0.12204 },
    { ageInMonths: 5, L: -0.0430, M: 6.8985, S: 0.11779 },
    { ageInMonths: 6, L: -0.0756, M: 7.2970, S: 0.11368 },
    { ageInMonths: 7, L: -0.1039, M: 7.6422, S: 0.10986 },
    { ageInMonths: 8, L: -0.1288, M: 7.9487, S: 0.10647 },
    { ageInMonths: 9, L: -0.1507, M: 8.2254, S: 0.10358 },
    { ageInMonths: 10, L: -0.1700, M: 8.4800, S: 0.10123 },
    { ageInMonths: 11, L: -0.1872, M: 8.7192, S: 0.09944 },
    { ageInMonths: 12, L: -0.2024, M: 8.9481, S: 0.09818 },
    { ageInMonths: 15, L: -0.2379, M: 9.6159, S: 0.09666 },
    { ageInMonths: 18, L: -0.2680, M: 10.2563, S: 0.09574 },
    { ageInMonths: 21, L: -0.2936, M: 10.8751, S: 0.09522 },
    { ageInMonths: 24, L: -0.3154, M: 11.4765, S: 0.09500 },
    { ageInMonths: 30, L: -0.3550, M: 12.6473, S: 0.09507 },
    { ageInMonths: 36, L: -0.3886, M: 13.7668, S: 0.09570 },
    { ageInMonths: 42, L: -0.4174, M: 14.8460, S: 0.09684 },
    { ageInMonths: 48, L: -0.4420, M: 15.8956, S: 0.09844 },
    { ageInMonths: 54, L: -0.4632, M: 16.9244, S: 0.10044 },
    { ageInMonths: 60, L: -0.4817, M: 17.9393, S: 0.10278 }
]

// Height-for-age standards (0-60 months)
export const HEIGHT_FOR_AGE_BOYS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 1, M: 49.8842, S: 0.03686 },
    { ageInMonths: 1, L: 1, M: 54.7244, S: 0.03293 },
    { ageInMonths: 2, L: 1, M: 58.4249, S: 0.03016 },
    { ageInMonths: 3, L: 1, M: 61.4292, S: 0.02806 },
    { ageInMonths: 4, L: 1, M: 63.8861, S: 0.02647 },
    { ageInMonths: 5, L: 1, M: 65.9026, S: 0.02525 },
    { ageInMonths: 6, L: 1, M: 67.6236, S: 0.02433 },
    { ageInMonths: 7, L: 1, M: 69.1645, S: 0.02364 },
    { ageInMonths: 8, L: 1, M: 70.5994, S: 0.02314 },
    { ageInMonths: 9, L: 1, M: 71.9687, S: 0.02280 },
    { ageInMonths: 10, L: 1, M: 73.2812, S: 0.02260 },
    { ageInMonths: 11, L: 1, M: 74.5388, S: 0.02252 },
    { ageInMonths: 12, L: 1, M: 75.7488, S: 0.02254 },
    { ageInMonths: 15, L: 1, M: 79.1786, S: 0.02294 },
    { ageInMonths: 18, L: 1, M: 82.2587, S: 0.02362 },
    { ageInMonths: 21, L: 1, M: 85.1094, S: 0.02449 },
    { ageInMonths: 24, L: 1, M: 87.7841, S: 0.02551 },
    { ageInMonths: 30, L: 1, M: 92.7659, S: 0.02782 },
    { ageInMonths: 36, L: 1, M: 97.2697, S: 0.03039 },
    { ageInMonths: 42, L: 1, M: 101.3977, S: 0.03315 },
    { ageInMonths: 48, L: 1, M: 105.2542, S: 0.03604 },
    { ageInMonths: 54, L: 1, M: 108.9014, S: 0.03902 },
    { ageInMonths: 60, L: 1, M: 112.3865, S: 0.04204 }
]

export const HEIGHT_FOR_AGE_GIRLS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 1, M: 49.1477, S: 0.03790 },
    { ageInMonths: 1, L: 1, M: 53.6872, S: 0.03368 },
    { ageInMonths: 2, L: 1, M: 57.0673, S: 0.03070 },
    { ageInMonths: 3, L: 1, M: 59.8029, S: 0.02849 },
    { ageInMonths: 4, L: 1, M: 62.0899, S: 0.02680 },
    { ageInMonths: 5, L: 1, M: 64.0301, S: 0.02549 },
    { ageInMonths: 6, L: 1, M: 65.7311, S: 0.02449 },
    { ageInMonths: 7, L: 1, M: 67.2873, S: 0.02372 },
    { ageInMonths: 8, L: 1, M: 68.7498, S: 0.02314 },
    { ageInMonths: 9, L: 1, M: 70.1435, S: 0.02272 },
    { ageInMonths: 10, L: 1, M: 71.4818, S: 0.02243 },
    { ageInMonths: 11, L: 1, M: 72.7711, S: 0.02226 },
    { ageInMonths: 12, L: 1, M: 74.0157, S: 0.02218 },
    { ageInMonths: 15, L: 1, M: 77.5063, S: 0.02247 },
    { ageInMonths: 18, L: 1, M: 80.7375, S: 0.02306 },
    { ageInMonths: 21, L: 1, M: 83.7839, S: 0.02386 },
    { ageInMonths: 24, L: 1, M: 86.6900, S: 0.02481 },
    { ageInMonths: 30, L: 1, M: 91.9687, S: 0.02703 },
    { ageInMonths: 36, L: 1, M: 96.7285, S: 0.02953 },
    { ageInMonths: 42, L: 1, M: 101.0687, S: 0.03223 },
    { ageInMonths: 48, L: 1, M: 105.0756, S: 0.03507 },
    { ageInMonths: 54, L: 1, M: 108.8071, S: 0.03801 },
    { ageInMonths: 60, L: 1, M: 112.2953, S: 0.04101 }
]

// Weight-for-height standards (45-120 cm)
export const WEIGHT_FOR_HEIGHT_BOYS: WHOStandardPoint[] = [
    { ageInMonths: 45, L: -0.3521, M: 2.441, S: 0.09182 },
    { ageInMonths: 50, L: -0.3521, M: 3.346, S: 0.08440 },
    { ageInMonths: 55, L: -0.3521, M: 4.432, S: 0.07777 },
    { ageInMonths: 60, L: -0.3521, M: 5.681, S: 0.07219 },
    { ageInMonths: 65, L: -0.3521, M: 7.071, S: 0.06787 },
    { ageInMonths: 70, L: -0.3521, M: 8.579, S: 0.06477 },
    { ageInMonths: 75, L: -0.3521, M: 10.185, S: 0.06270 },
    { ageInMonths: 80, L: -0.3521, M: 11.869, S: 0.06142 },
    { ageInMonths: 85, L: -0.3521, M: 13.612, S: 0.06071 },
    { ageInMonths: 90, L: -0.3521, M: 15.395, S: 0.06041 },
    { ageInMonths: 95, L: -0.3521, M: 17.201, S: 0.06041 },
    { ageInMonths: 100, L: -0.3521, M: 19.016, S: 0.06064 },
    { ageInMonths: 105, L: -0.3521, M: 20.827, S: 0.06105 },
    { ageInMonths: 110, L: -0.3521, M: 22.622, S: 0.06161 },
    { ageInMonths: 115, L: -0.3521, M: 24.393, S: 0.06229 },
    { ageInMonths: 120, L: -0.3521, M: 26.134, S: 0.06305 }
]

export const WEIGHT_FOR_HEIGHT_GIRLS: WHOStandardPoint[] = [
    { ageInMonths: 45, L: -0.3833, M: 2.248, S: 0.08778 },
    { ageInMonths: 50, L: -0.3833, M: 3.080, S: 0.08122 },
    { ageInMonths: 55, L: -0.3833, M: 4.073, S: 0.07533 },
    { ageInMonths: 60, L: -0.3833, M: 5.207, S: 0.07025 },
    { ageInMonths: 65, L: -0.3833, M: 6.464, S: 0.06606 },
    { ageInMonths: 70, L: -0.3833, M: 7.824, S: 0.06281 },
    { ageInMonths: 75, L: -0.3833, M: 9.268, S: 0.06049 },
    { ageInMonths: 80, L: -0.3833, M: 10.781, S: 0.05902 },
    { ageInMonths: 85, L: -0.3833, M: 12.349, S: 0.05829 },
    { ageInMonths: 90, L: -0.3833, M: 13.960, S: 0.05820 },
    { ageInMonths: 95, L: -0.3833, M: 15.604, S: 0.05866 },
    { ageInMonths: 100, L: -0.3833, M: 17.270, S: 0.05959 },
    { ageInMonths: 105, L: -0.3833, M: 18.950, S: 0.06093 },
    { ageInMonths: 110, L: -0.3833, M: 20.636, S: 0.06262 },
    { ageInMonths: 115, L: -0.3833, M: 22.322, S: 0.06462 },
    { ageInMonths: 120, L: -0.3833, M: 24.002, S: 0.06687 }
]

// Head circumference-for-age standards (0-60 months)
export const HEAD_CIRCUMFERENCE_FOR_AGE_BOYS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 1, M: 34.4618, S: 0.03686 },
    { ageInMonths: 1, L: 1, M: 37.2759, S: 0.03293 },
    { ageInMonths: 2, L: 1, M: 39.1285, S: 0.03016 },
    { ageInMonths: 3, L: 1, M: 40.5135, S: 0.02806 },
    { ageInMonths: 4, L: 1, M: 41.6317, S: 0.02647 },
    { ageInMonths: 5, L: 1, M: 42.5576, S: 0.02525 },
    { ageInMonths: 6, L: 1, M: 43.3306, S: 0.02433 },
    { ageInMonths: 7, L: 1, M: 44.0108, S: 0.02364 },
    { ageInMonths: 8, L: 1, M: 44.6154, S: 0.02314 },
    { ageInMonths: 9, L: 1, M: 45.1540, S: 0.02280 },
    { ageInMonths: 10, L: 1, M: 45.6355, S: 0.02260 },
    { ageInMonths: 11, L: 1, M: 46.0677, S: 0.02252 },
    { ageInMonths: 12, L: 1, M: 46.4573, S: 0.02254 },
    { ageInMonths: 15, L: 1, M: 47.4216, S: 0.02294 },
    { ageInMonths: 18, L: 1, M: 48.2288, S: 0.02362 },
    { ageInMonths: 21, L: 1, M: 48.9171, S: 0.02449 },
    { ageInMonths: 24, L: 1, M: 49.5138, S: 0.02551 },
    { ageInMonths: 30, L: 1, M: 50.4308, S: 0.02782 },
    { ageInMonths: 36, L: 1, M: 51.1508, S: 0.03039 },
    { ageInMonths: 42, L: 1, M: 51.7235, S: 0.03315 },
    { ageInMonths: 48, L: 1, M: 52.1846, S: 0.03604 },
    { ageInMonths: 54, L: 1, M: 52.5584, S: 0.03902 },
    { ageInMonths: 60, L: 1, M: 52.8633, S: 0.04204 }
]

export const HEAD_CIRCUMFERENCE_FOR_AGE_GIRLS: WHOStandardPoint[] = [
    { ageInMonths: 0, L: 1, M: 33.8787, S: 0.03790 },
    { ageInMonths: 1, L: 1, M: 36.5463, S: 0.03368 },
    { ageInMonths: 2, L: 1, M: 38.2521, S: 0.03070 },
    { ageInMonths: 3, L: 1, M: 39.5328, S: 0.02849 },
    { ageInMonths: 4, L: 1, M: 40.5574, S: 0.02680 },
    { ageInMonths: 5, L: 1, M: 41.4184, S: 0.02549 },
    { ageInMonths: 6, L: 1, M: 42.1618, S: 0.02449 },
    { ageInMonths: 7, L: 1, M: 42.8200, S: 0.02372 },
    { ageInMonths: 8, L: 1, M: 43.4107, S: 0.02314 },
    { ageInMonths: 9, L: 1, M: 43.9462, S: 0.02272 },
    { ageInMonths: 10, L: 1, M: 44.4358, S: 0.02243 },
    { ageInMonths: 11, L: 1, M: 44.8866, S: 0.02226 },
    { ageInMonths: 12, L: 1, M: 45.3048, S: 0.02218 },
    { ageInMonths: 15, L: 1, M: 46.3932, S: 0.02247 },
    { ageInMonths: 18, L: 1, M: 47.3301, S: 0.02306 },
    { ageInMonths: 21, L: 1, M: 48.1477, S: 0.02386 },
    { ageInMonths: 24, L: 1, M: 48.8707, S: 0.02481 },
    { ageInMonths: 30, L: 1, M: 50.0762, S: 0.02703 },
    { ageInMonths: 36, L: 1, M: 51.0455, S: 0.02953 },
    { ageInMonths: 42, L: 1, M: 51.8444, S: 0.03223 },
    { ageInMonths: 48, L: 1, M: 52.5117, S: 0.03507 },
    { ageInMonths: 54, L: 1, M: 53.0781, S: 0.03801 },
    { ageInMonths: 60, L: 1, M: 53.5681, S: 0.04101 }
]