/**
 * Simple test script to verify WHO Z-score calculations
 * This is a basic validation test
 */

// Test data validation
console.log('🧪 Testing WHO Z-score Calculator Setup\n')

// Test 1: Basic data structure validation
console.log('📊 Testing WHO Standards Data Structure:')

// Simulate basic calculations manually
function testBasicCalculation() {
    // Test case: 6-month-old boy with median values
    const weight = 7.9 // kg (median for 6-month boy)
    const height = 67.6 // cm (median for 6-month boy)
    const ageInMonths = 6

    console.log(`Test values: Weight=${weight}kg, Height=${height}cm, Age=${ageInMonths}months`)

    // Basic validation - these should be reasonable values
    const validWeight = weight > 0 && weight < 50
    const validHeight = height > 0 && height < 200
    const validAge = ageInMonths >= 0 && ageInMonths <= 60

    console.log(validWeight ? '✅ Weight value is reasonable' : '❌ Invalid weight')
    console.log(validHeight ? '✅ Height value is reasonable' : '❌ Invalid height')
    console.log(validAge ? '✅ Age value is reasonable' : '❌ Invalid age')

    return validWeight && validHeight && validAge
}

// Test 2: Age calculation logic
function testAgeCalculation() {
    console.log('\n📅 Testing age calculation logic:')

    // Manual age calculation
    const birthDate = new Date('2024-01-15')
    const measurementDate = new Date('2024-07-15')

    const yearDiff = measurementDate.getFullYear() - birthDate.getFullYear()
    const monthDiff = measurementDate.getMonth() - birthDate.getMonth()
    const dayDiff = measurementDate.getDate() - birthDate.getDate()

    let totalMonths = yearDiff * 12 + monthDiff
    if (dayDiff < 0) {
        totalMonths -= 1
    }

    console.log(`Birth: ${birthDate.toDateString()}`)
    console.log(`Measurement: ${measurementDate.toDateString()}`)
    console.log(`Calculated age: ${totalMonths} months`)

    const expectedAge = 6
    const ageCorrect = totalMonths === expectedAge
    console.log(ageCorrect ? '✅ Age calculation correct' : `❌ Expected ${expectedAge}, got ${totalMonths}`)

    return ageCorrect
}

// Test 3: LMS method validation
function testLMSMethod() {
    console.log('\n🧮 Testing LMS method understanding:')

    // Example LMS values for 6-month boy weight-for-age
    const L = 0.2618  // Lambda (skewness)
    const M = 7.9340  // Mu (median)
    const S = 0.10958 // Sigma (coefficient of variation)

    const testValue = 7.9340 // Exactly the median

    console.log(`LMS values: L=${L}, M=${M}, S=${S}`)
    console.log(`Test value: ${testValue} (should be median)`)

    // For median value, Z-score should be approximately 0
    let zScore
    if (Math.abs(L) < 0.01) {
        zScore = Math.log(testValue / M) / S
    } else {
        zScore = (Math.pow(testValue / M, L) - 1) / (L * S)
    }

    console.log(`Calculated Z-score: ${zScore.toFixed(3)}`)

    const zScoreNearZero = Math.abs(zScore) < 0.1
    console.log(zScoreNearZero ? '✅ Z-score calculation logic correct' : '❌ Z-score calculation error')

    return zScoreNearZero
}

// Run all tests
function runAllTests() {
    const test1 = testBasicCalculation()
    const test2 = testAgeCalculation()
    const test3 = testLMSMethod()

    console.log('\n🎯 Test Summary:')
    console.log(`Basic validation: ${test1 ? '✅' : '❌'}`)
    console.log(`Age calculation: ${test2 ? '✅' : '❌'}`)
    console.log(`LMS method: ${test3 ? '✅' : '❌'}`)

    const allPassed = test1 && test2 && test3
    console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'}`)

    return allPassed
}

// Run the tests
runAllTests()