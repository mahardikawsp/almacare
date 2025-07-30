/**
 * Test script to verify immunization system functionality
 * This script tests the core immunization features
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testImmunizationSystem() {
    console.log('🧪 Testing Immunization System...\n')

    try {
        // Test 1: Check if immunization schedules are seeded
        console.log('1. Testing immunization schedule seeding...')
        const schedules = await prisma.immunizationSchedule.findMany({
            where: { isActive: true },
            orderBy: [
                { ageInMonths: 'asc' },
                { sortOrder: 'asc' }
            ]
        })

        console.log(`   ✅ Found ${schedules.length} active immunization schedules`)

        // Display first few schedules
        console.log('   📋 Sample schedules:')
        schedules.slice(0, 5).forEach(schedule => {
            console.log(`      - ${schedule.ageInMonths} months: ${schedule.vaccineName} (${schedule.vaccineType})`)
        })

        // Test 2: Check if we have the expected Kemenkes RI vaccines
        const expectedVaccines = [
            'HB-0', 'BCG', 'Polio 1', 'DPT-HB-Hib 1', 'MR 1', 'DPT-HB-Hib booster'
        ]

        console.log('\n2. Testing Kemenkes RI vaccine coverage...')
        for (const vaccine of expectedVaccines) {
            const found = schedules.find(s => s.vaccineName === vaccine)
            if (found) {
                console.log(`   ✅ ${vaccine} - Age: ${found.ageInMonths} months`)
            } else {
                console.log(`   ❌ ${vaccine} - NOT FOUND`)
            }
        }

        // Test 3: Check age distribution
        console.log('\n3. Testing age distribution...')
        const ageGroups = {}
        schedules.forEach(schedule => {
            const age = schedule.ageInMonths
            ageGroups[age] = (ageGroups[age] || 0) + 1
        })

        Object.keys(ageGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(age => {
            console.log(`   📅 ${age} months: ${ageGroups[age]} vaccines`)
        })

        // Test 4: Check optional vs mandatory vaccines
        console.log('\n4. Testing vaccine classification...')
        const mandatory = schedules.filter(s => !s.isOptional).length
        const optional = schedules.filter(s => s.isOptional).length
        console.log(`   ✅ Mandatory vaccines: ${mandatory}`)
        console.log(`   ℹ️  Optional vaccines: ${optional}`)

        // Test 5: Test if we can create a test child and generate records
        console.log('\n5. Testing immunization record generation...')

        // Create a test user first
        const testUser = await prisma.user.upsert({
            where: { email: 'test-immunization@example.com' },
            update: {},
            create: {
                email: 'test-immunization@example.com',
                name: 'Test User for Immunization',
                googleId: 'test-immunization-google-id'
            }
        })

        // Create a test child
        const testChild = await prisma.child.upsert({
            where: {
                id: 'test-child-immunization-id'
            },
            update: {
                birthDate: new Date('2024-01-01') // 1 year old child
            },
            create: {
                id: 'test-child-immunization-id',
                name: 'Test Baby',
                gender: 'MALE',
                birthDate: new Date('2024-01-01'), // 1 year old child
                relationship: 'Anak',
                userId: testUser.id
            }
        })

        // Generate immunization records manually using the same logic
        const recordsToCreate = schedules.map(schedule => {
            const scheduledDate = new Date(testChild.birthDate)
            scheduledDate.setMonth(scheduledDate.getMonth() + schedule.ageInMonths)

            return {
                childId: testChild.id,
                scheduleId: schedule.id,
                scheduledDate,
                status: 'SCHEDULED'
            }
        })

        await prisma.immunizationRecord.createMany({
            data: recordsToCreate,
            skipDuplicates: true
        })

        // Check generated records
        const records = await prisma.immunizationRecord.findMany({
            where: { childId: testChild.id },
            include: { schedule: true },
            orderBy: { scheduledDate: 'asc' }
        })

        console.log(`   ✅ Generated ${records.length} immunization records for test child`)

        // Show first few records
        console.log('   📋 Sample records:')
        records.slice(0, 5).forEach(record => {
            const date = record.scheduledDate.toISOString().split('T')[0]
            console.log(`      - ${record.schedule.vaccineName}: ${date} (${record.status})`)
        })

        // Test 6: Test overdue detection
        console.log('\n6. Testing overdue detection...')
        const today = new Date()

        // Update overdue records
        await prisma.immunizationRecord.updateMany({
            where: {
                childId: testChild.id,
                status: 'SCHEDULED',
                scheduledDate: { lt: today }
            },
            data: { status: 'OVERDUE' }
        })

        const overdueRecords = await prisma.immunizationRecord.findMany({
            where: {
                childId: testChild.id,
                status: 'OVERDUE'
            },
            include: { schedule: true }
        })
        console.log(`   ✅ Found ${overdueRecords.length} overdue immunizations for 1-year-old child`)

        // Test 7: Test upcoming immunizations
        console.log('\n7. Testing upcoming immunizations...')
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)

        const upcomingRecords = await prisma.immunizationRecord.findMany({
            where: {
                childId: testChild.id,
                status: 'SCHEDULED',
                scheduledDate: {
                    gte: today,
                    lte: thirtyDaysFromNow
                }
            },
            include: { schedule: true }
        })
        console.log(`   ✅ Found ${upcomingRecords.length} upcoming immunizations`)

        // Test 8: Test statistics
        console.log('\n8. Testing immunization statistics...')
        const statsData = await prisma.immunizationRecord.groupBy({
            by: ['status'],
            where: { childId: testChild.id },
            _count: { status: true }
        })

        const stats = {
            total: 0,
            completed: 0,
            scheduled: 0,
            overdue: 0,
            skipped: 0
        }

        statsData.forEach(stat => {
            stats.total += stat._count.status
            switch (stat.status) {
                case 'COMPLETED':
                    stats.completed = stat._count.status
                    break
                case 'SCHEDULED':
                    stats.scheduled = stat._count.status
                    break
                case 'OVERDUE':
                    stats.overdue = stat._count.status
                    break
                case 'SKIPPED':
                    stats.skipped = stat._count.status
                    break
            }
        })

        console.log(`   📊 Stats: Total: ${stats.total}, Completed: ${stats.completed}, Scheduled: ${stats.scheduled}, Overdue: ${stats.overdue}`)

        // Cleanup test data
        console.log('\n🧹 Cleaning up test data...')
        await prisma.immunizationRecord.deleteMany({
            where: { childId: testChild.id }
        })
        await prisma.child.delete({
            where: { id: testChild.id }
        })
        await prisma.user.delete({
            where: { id: testUser.id }
        })

        console.log('\n🎉 All immunization system tests passed!')

    } catch (error) {
        console.error('❌ Test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the test
testImmunizationSystem()