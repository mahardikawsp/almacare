import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyImmunizationData() {
    console.log('🔍 Verifying immunization schedules...')

    const totalSchedules = await prisma.immunizationSchedule.count()
    const mandatorySchedules = await prisma.immunizationSchedule.count({
        where: { isOptional: false }
    })
    const optionalSchedules = await prisma.immunizationSchedule.count({
        where: { isOptional: true }
    })

    console.log(`📊 Immunization Statistics:`)
    console.log(`   Total schedules: ${totalSchedules}`)
    console.log(`   Mandatory: ${mandatorySchedules}`)
    console.log(`   Optional: ${optionalSchedules}`)

    // Group by vaccine type
    const vaccineTypes = await prisma.immunizationSchedule.groupBy({
        by: ['vaccineType'],
        _count: {
            vaccineType: true
        },
        orderBy: {
            _count: {
                vaccineType: 'desc'
            }
        }
    })

    console.log(`\n📋 Vaccine Types:`)
    vaccineTypes.forEach(type => {
        console.log(`   ${type.vaccineType}: ${type._count.vaccineType} doses`)
    })

    // Age distribution
    const ageGroups = await prisma.immunizationSchedule.groupBy({
        by: ['ageInMonths'],
        _count: {
            ageInMonths: true
        },
        orderBy: {
            ageInMonths: 'asc'
        }
    })

    console.log(`\n📅 Age Distribution:`)
    ageGroups.forEach(age => {
        const ageLabel = age.ageInMonths === 0 ? 'Birth' :
            age.ageInMonths < 12 ? `${age.ageInMonths} months` :
                age.ageInMonths === 12 ? '1 year' :
                    `${Math.floor(age.ageInMonths / 12)} years ${age.ageInMonths % 12} months`
        console.log(`   ${ageLabel}: ${age._count.ageInMonths} vaccines`)
    })
}

async function verifyMPASIData() {
    console.log('\n🔍 Verifying MPASI recipes...')

    const totalRecipes = await prisma.mPASIRecipe.count()

    console.log(`📊 MPASI Statistics:`)
    console.log(`   Total recipes: ${totalRecipes}`)

    // Group by texture
    const textureGroups = await prisma.mPASIRecipe.groupBy({
        by: ['texture'],
        _count: {
            texture: true
        },
        orderBy: {
            texture: 'asc'
        }
    })

    console.log(`\n🥄 Texture Distribution:`)
    textureGroups.forEach(texture => {
        console.log(`   ${texture.texture}: ${texture._count.texture} recipes`)
    })

    // Age range distribution
    const ageRanges = await prisma.mPASIRecipe.groupBy({
        by: ['ageRangeMin', 'ageRangeMax'],
        _count: {
            ageRangeMin: true
        },
        orderBy: {
            ageRangeMin: 'asc'
        }
    })

    console.log(`\n📅 Age Range Distribution:`)
    ageRanges.forEach(range => {
        console.log(`   ${range.ageRangeMin}-${range.ageRangeMax} months: ${range._count.ageRangeMin} recipes`)
    })

    // Sample recipes by texture
    console.log(`\n📝 Sample Recipes by Texture:`)
    for (const textureGroup of textureGroups) {
        const sampleRecipe = await prisma.mPASIRecipe.findFirst({
            where: { texture: textureGroup.texture },
            select: { name: true, ageRangeMin: true, ageRangeMax: true }
        })
        if (sampleRecipe) {
            console.log(`   ${textureGroup.texture}: "${sampleRecipe.name}" (${sampleRecipe.ageRangeMin}-${sampleRecipe.ageRangeMax} months)`)
        }
    }
}

async function verifyDataIntegrity() {
    console.log('\n🔍 Verifying data integrity...')

    // Check for duplicate immunization schedules
    const duplicateImmunizations = await prisma.immunizationSchedule.groupBy({
        by: ['ageInMonths', 'vaccineName'],
        _count: {
            id: true
        },
        having: {
            id: {
                _count: {
                    gt: 1
                }
            }
        }
    })

    if (duplicateImmunizations.length > 0) {
        console.log(`❌ Found ${duplicateImmunizations.length} duplicate immunization schedules`)
        duplicateImmunizations.forEach(dup => {
            console.log(`   - ${dup.vaccineName} at ${dup.ageInMonths} months (${dup._count.id} duplicates)`)
        })
    } else {
        console.log(`✅ No duplicate immunization schedules found`)
    }

    // Check for duplicate MPASI recipes
    const duplicateRecipes = await prisma.mPASIRecipe.groupBy({
        by: ['name'],
        _count: {
            id: true
        },
        having: {
            id: {
                _count: {
                    gt: 1
                }
            }
        }
    })

    if (duplicateRecipes.length > 0) {
        console.log(`❌ Found ${duplicateRecipes.length} duplicate MPASI recipes`)
        duplicateRecipes.forEach(dup => {
            console.log(`   - "${dup.name}" (${dup._count.id} duplicates)`)
        })
    } else {
        console.log(`✅ No duplicate MPASI recipes found`)
    }

    // Check age range validity for MPASI
    const invalidAgeRanges = await prisma.mPASIRecipe.findMany({
        where: {
            ageRangeMin: {
                gte: prisma.mPASIRecipe.fields.ageRangeMax
            }
        },
        select: { name: true, ageRangeMin: true, ageRangeMax: true }
    })

    if (invalidAgeRanges.length > 0) {
        console.log(`❌ Found ${invalidAgeRanges.length} recipes with invalid age ranges`)
        invalidAgeRanges.forEach(recipe => {
            console.log(`   - "${recipe.name}": ${recipe.ageRangeMin}-${recipe.ageRangeMax} months`)
        })
    } else {
        console.log(`✅ All MPASI recipes have valid age ranges`)
    }
}

async function main() {
    try {
        console.log('🚀 Starting seed verification...\n')

        await verifyImmunizationData()
        await verifyMPASIData()
        await verifyDataIntegrity()

        console.log('\n🎉 Seed verification completed successfully!')
    } catch (error) {
        console.error('❌ Error during verification:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })