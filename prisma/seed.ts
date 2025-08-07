import { PrismaClient } from '@prisma/client'
import { IMMUNIZATION_MASTER_DATA } from './data/immunization-data'
import { MPASI_RECIPES_DATA } from './data/mpasi-data'

const prisma = new PrismaClient()

async function seedImmunizationSchedules() {
    console.log('🌱 Seeding immunization schedules...')

    for (const schedule of IMMUNIZATION_MASTER_DATA) {
        await prisma.immunizationSchedule.upsert({
            where: {
                ageInMonths_vaccineName: {
                    ageInMonths: schedule.ageInMonths,
                    vaccineName: schedule.vaccineName
                }
            },
            update: {
                vaccineType: schedule.vaccineType,
                isOptional: schedule.isOptional,
                description: schedule.description,
                sortOrder: schedule.sortOrder,
                isActive: schedule.isActive
            },
            create: schedule
        })
    }

    console.log('✅ Immunization schedules seeded successfully')
}

async function seedMPASIRecipes() {
    console.log('🌱 Seeding MPASI recipes...')

    for (const recipe of MPASI_RECIPES_DATA) {
        await prisma.mPASIRecipe.upsert({
            where: {
                name: recipe.name
            },
            update: {
                ageRangeMin: recipe.ageRangeMin,
                ageRangeMax: recipe.ageRangeMax,
                texture: recipe.texture as any,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                nutrition: recipe.nutrition,
                imageUrl: recipe.imageUrl
            },
            create: {
                name: recipe.name,
                ageRangeMin: recipe.ageRangeMin,
                ageRangeMax: recipe.ageRangeMax,
                texture: recipe.texture as any,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                nutrition: recipe.nutrition,
                imageUrl: recipe.imageUrl
            }
        })
    }

    console.log('✅ MPASI recipes seeded successfully')
}

async function main() {
    try {
        await seedImmunizationSchedules()
        await seedMPASIRecipes()
        console.log('🎉 Database seeding completed successfully!')
    } catch (error) {
        console.error('❌ Error during seeding:', error)
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