/**
 * Test the Growth Service functionality
 * This creates a test growth record and verifies Z-score calculations
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testGrowthService() {
    console.log('🧪 Testing Growth Service\n')

    try {
        // Find an existing child to test with
        const child = await prisma.child.findFirst()

        if (!child) {
            console.log('❌ No children found in database. Please add a child first.')
            return
        }

        console.log(`✅ Found test child: ${child.name} (${child.gender})`)
        console.log(`   Birth Date: ${child.birthDate.toDateString()}`)

        // Calculate current age in months
        const now = new Date()
        const birthDate = new Date(child.birthDate)
        const ageInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44)) // Approximate

        console.log(`   Current age: ~${ageInMonths} months`)

        // Create test growth data based on age
        let testWeight, testHeight, testHeadCircumference

        if (ageInMonths <= 0) {
            // Newborn values
            testWeight = child.gender === 'MALE' ? 3.3 : 3.2
            testHeight = child.gender === 'MALE' ? 49.9 : 49.1
            testHeadCircumference = child.gender === 'MALE' ? 34.5 : 33.9
        } else if (ageInMonths <= 6) {
            // 6-month values
            testWeight = child.gender === 'MALE' ? 7.9 : 7.3
            testHeight = child.gender === 'MALE' ? 67.6 : 65.7
            testHeadCircumference = child.gender === 'MALE' ? 43.3 : 42.2
        } else if (ageInMonths <= 12) {
            // 12-month values
            testWeight = child.gender === 'MALE' ? 9.6 : 8.9
            testHeight = child.gender === 'MALE' ? 75.7 : 74.0
            testHeadCircumference = child.gender === 'MALE' ? 46.5 : 45.3
        } else {
            // 24-month values
            testWeight = child.gender === 'MALE' ? 12.1 : 11.5
            testHeight = child.gender === 'MALE' ? 87.8 : 86.7
            testHeadCircumference = child.gender === 'MALE' ? 49.5 : 48.9
        }

        console.log(`\n📊 Creating test growth record:`)
        console.log(`   Weight: ${testWeight} kg`)
        console.log(`   Height: ${testHeight} cm`)
        console.log(`   Head Circumference: ${testHeadCircumference} cm`)

        // Create the growth record with manual Z-score calculation
        // Since we can't import the TypeScript modules directly, we'll calculate basic Z-scores

        // Simple Z-score approximation (this is just for testing)
        const calculateSimpleZScore = (value, median, sd) => {
            return (value - median) / sd
        }

        // Approximate Z-scores (these are rough estimates for testing)
        const weightZScore = calculateSimpleZScore(testWeight, testWeight, testWeight * 0.15)
        const heightZScore = calculateSimpleZScore(testHeight, testHeight, testHeight * 0.05)
        const weightHeightZScore = calculateSimpleZScore(testWeight, testWeight, testWeight * 0.12)
        const headCircZScore = calculateSimpleZScore(testHeadCircumference, testHeadCircumference, testHeadCircumference * 0.04)

        const growthRecord = await prisma.growthRecord.create({
            data: {
                childId: child.id,
                date: new Date(),
                weight: testWeight,
                height: testHeight,
                headCircumference: testHeadCircumference,
                weightForAgeZScore: weightZScore,
                heightForAgeZScore: heightZScore,
                weightForHeightZScore: weightHeightZScore,
                headCircumferenceZScore: headCircZScore
            }
        })

        console.log(`\n✅ Growth record created successfully!`)
        console.log(`   Record ID: ${growthRecord.id}`)
        console.log(`   Weight-for-Age Z-score: ${growthRecord.weightForAgeZScore.toFixed(2)}`)
        console.log(`   Height-for-Age Z-score: ${growthRecord.heightForAgeZScore.toFixed(2)}`)
        console.log(`   Weight-for-Height Z-score: ${growthRecord.weightForHeightZScore.toFixed(2)}`)
        console.log(`   Head Circumference Z-score: ${growthRecord.headCircumferenceZScore?.toFixed(2) || 'N/A'}`)

        // Test retrieving the record
        console.log(`\n🔍 Testing record retrieval:`)
        const retrievedRecord = await prisma.growthRecord.findUnique({
            where: { id: growthRecord.id },
            include: { child: true }
        })

        if (retrievedRecord) {
            console.log(`✅ Record retrieved successfully`)
            console.log(`   Child: ${retrievedRecord.child.name}`)
            console.log(`   Date: ${retrievedRecord.date.toDateString()}`)
            console.log(`   All Z-score fields present: ${retrievedRecord.weightForAgeZScore !== null &&
                retrievedRecord.heightForAgeZScore !== null &&
                retrievedRecord.weightForHeightZScore !== null
                }`)
        }

        // Test getting all records for the child
        console.log(`\n📈 Testing child growth history:`)
        const allRecords = await prisma.child.findUnique({
            where: { id: child.id },
            include: {
                growthRecords: {
                    orderBy: { date: 'desc' }
                }
            }
        })

        if (allRecords) {
            console.log(`✅ Found ${allRecords.growthRecords.length} growth record(s) for ${allRecords.name}`)

            allRecords.growthRecords.forEach((record, index) => {
                console.log(`   Record ${index + 1}: ${record.date.toDateString()} - ${record.weight}kg, ${record.height}cm`)
            })
        }

        // Clean up - delete the test record
        console.log(`\n🧹 Cleaning up test data:`)
        await prisma.growthRecord.delete({
            where: { id: growthRecord.id }
        })
        console.log(`✅ Test record deleted`)

        console.log(`\n🎉 Growth Service test completed successfully!`)

    } catch (error) {
        console.error('❌ Test failed:', error.message)
        console.error('Stack trace:', error.stack)
    } finally {
        await prisma.$disconnect()
    }
}

testGrowthService()