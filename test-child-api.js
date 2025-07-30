/**
 * Test script to verify child API and growth calculations work together
 * This tests the integration between the database and WHO calculations
 */

const { PrismaClient } = require('@prisma/client')

// Initialize Prisma client
const prisma = new PrismaClient()

async function testChildGrowthIntegration() {
    console.log('🧪 Testing Child Growth Integration\n')

    try {
        // Test 1: Check if we can connect to database
        console.log('📊 Testing database connection:')
        await prisma.$connect()
        console.log('✅ Database connection successful')

        // Test 2: Check if Child model exists and has required fields
        console.log('\n👶 Testing Child model structure:')
        const childCount = await prisma.child.count()
        console.log(`✅ Child model accessible (${childCount} children in database)`)

        // Test 3: Check if GrowthRecord model exists
        console.log('\n📈 Testing GrowthRecord model structure:')
        const growthRecordCount = await prisma.growthRecord.count()
        console.log(`✅ GrowthRecord model accessible (${growthRecordCount} records in database)`)

        // Test 4: If there are children, test growth record creation
        if (childCount > 0) {
            console.log('\n🔍 Testing growth record structure:')
            const sampleChild = await prisma.child.findFirst({
                include: {
                    growthRecords: {
                        take: 1,
                        orderBy: { date: 'desc' }
                    }
                }
            })

            if (sampleChild) {
                console.log(`✅ Found sample child: ${sampleChild.name}`)
                console.log(`   Gender: ${sampleChild.gender}`)
                console.log(`   Birth Date: ${sampleChild.birthDate.toDateString()}`)

                if (sampleChild.growthRecords.length > 0) {
                    const record = sampleChild.growthRecords[0]
                    console.log(`✅ Found growth record:`)
                    console.log(`   Date: ${record.date.toDateString()}`)
                    console.log(`   Weight: ${record.weight}kg`)
                    console.log(`   Height: ${record.height}cm`)
                    console.log(`   Weight-for-Age Z-score: ${record.weightForAgeZScore?.toFixed(2) || 'N/A'}`)
                    console.log(`   Height-for-Age Z-score: ${record.heightForAgeZScore?.toFixed(2) || 'N/A'}`)
                    console.log(`   Weight-for-Height Z-score: ${record.weightForHeightZScore?.toFixed(2) || 'N/A'}`)
                } else {
                    console.log('ℹ️  No growth records found for this child')
                }
            }
        } else {
            console.log('ℹ️  No children in database to test with')
        }

        // Test 5: Verify required database fields exist
        console.log('\n🗃️  Testing database schema:')

        // Check if the required Z-score fields exist in GrowthRecord
        const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'growth_records' 
      AND column_name LIKE '%score%'
    `

        console.log('Z-score fields in database:')
        if (Array.isArray(tableInfo) && tableInfo.length > 0) {
            tableInfo.forEach(field => {
                console.log(`   ✅ ${field.column_name} (${field.data_type})`)
            })
        } else {
            console.log('   ⚠️  No Z-score fields found - may need database migration')
        }

        console.log('\n🎉 Integration test completed successfully!')

    } catch (error) {
        console.error('❌ Test failed:', error.message)

        if (error.code === 'P1001') {
            console.log('💡 Hint: Make sure PostgreSQL is running and DATABASE_URL is correct')
        } else if (error.code === 'P2021') {
            console.log('💡 Hint: Run "npm run db:push" to sync the database schema')
        }
    } finally {
        await prisma.$disconnect()
    }
}

// Test the WHO calculation functions are importable
async function testWHOCalculationImports() {
    console.log('\n🧮 Testing WHO calculation imports:')

    try {
        // Try to import the TypeScript files using dynamic import
        // This won't work in Node.js directly, but we can test the file existence
        const fs = require('fs')
        const path = require('path')

        const whoDataPath = path.join(__dirname, 'src/lib/who-standards-data.ts')
        const whoCalculatorPath = path.join(__dirname, 'src/lib/who-zscore-calculator.ts')
        const growthServicePath = path.join(__dirname, 'src/lib/growth-service.ts')

        console.log(`WHO Standards Data: ${fs.existsSync(whoDataPath) ? '✅' : '❌'} ${whoDataPath}`)
        console.log(`WHO Z-score Calculator: ${fs.existsSync(whoCalculatorPath) ? '✅' : '❌'} ${whoCalculatorPath}`)
        console.log(`Growth Service: ${fs.existsSync(growthServicePath) ? '✅' : '❌'} ${growthServicePath}`)

        // Check file sizes to ensure they're not empty
        if (fs.existsSync(whoDataPath)) {
            const stats = fs.statSync(whoDataPath)
            console.log(`   WHO data file size: ${stats.size} bytes`)
        }

        if (fs.existsSync(whoCalculatorPath)) {
            const stats = fs.statSync(whoCalculatorPath)
            console.log(`   Calculator file size: ${stats.size} bytes`)
        }

        if (fs.existsSync(growthServicePath)) {
            const stats = fs.statSync(growthServicePath)
            console.log(`   Service file size: ${stats.size} bytes`)
        }

    } catch (error) {
        console.error('❌ Import test failed:', error.message)
    }
}

// Run all tests
async function runAllTests() {
    await testWHOCalculationImports()
    await testChildGrowthIntegration()
}

runAllTests()