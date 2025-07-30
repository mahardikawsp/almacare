import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Master data for Indonesian immunization schedule based on Kemenkes RI
const IMMUNIZATION_MASTER_DATA = [
    { ageInMonths: 0, vaccineName: 'HB-0', vaccineType: 'Hepatitis B', isOptional: false, sortOrder: 1, isActive: true, description: 'Hepatitis B dosis pertama, diberikan segera setelah lahir' },
    { ageInMonths: 1, vaccineName: 'BCG', vaccineType: 'BCG', isOptional: false, sortOrder: 1, isActive: true, description: 'Bacillus Calmette-Guérin untuk mencegah tuberkulosis' },
    { ageInMonths: 1, vaccineName: 'Polio 1', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis pertama' },
    { ageInMonths: 2, vaccineName: 'DPT-HB-Hib 1', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'Difteri, Pertusis, Tetanus, Hepatitis B, Haemophilus influenzae type b dosis pertama' },
    { ageInMonths: 2, vaccineName: 'Polio 2', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis kedua' },
    { ageInMonths: 2, vaccineName: 'Rotavirus 1', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis pertama untuk mencegah diare' },
    { ageInMonths: 3, vaccineName: 'DPT-HB-Hib 2', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib dosis kedua' },
    { ageInMonths: 3, vaccineName: 'Polio 3', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis ketiga' },
    { ageInMonths: 3, vaccineName: 'Rotavirus 2', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis kedua' },
    { ageInMonths: 4, vaccineName: 'DPT-HB-Hib 3', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib dosis ketiga' },
    { ageInMonths: 4, vaccineName: 'Polio 4', vaccineType: 'Polio', isOptional: false, sortOrder: 2, isActive: true, description: 'Polio dosis keempat' },
    { ageInMonths: 4, vaccineName: 'Rotavirus 3', vaccineType: 'Rotavirus', isOptional: false, sortOrder: 3, isActive: true, description: 'Rotavirus dosis ketiga' },
    { ageInMonths: 9, vaccineName: 'MR 1', vaccineType: 'Campak-Rubella', isOptional: false, sortOrder: 1, isActive: true, description: 'Campak-Rubella dosis pertama' },
    { ageInMonths: 9, vaccineName: 'JE', vaccineType: 'Japanese Encephalitis', isOptional: true, sortOrder: 2, isActive: true, description: 'Japanese Encephalitis (opsional)' },
    { ageInMonths: 18, vaccineName: 'DPT-HB-Hib booster', vaccineType: 'DPT-HB-Hib', isOptional: false, sortOrder: 1, isActive: true, description: 'DPT-HB-Hib booster' },
    { ageInMonths: 18, vaccineName: 'MR 2', vaccineType: 'Campak-Rubella', isOptional: false, sortOrder: 2, isActive: true, description: 'Campak-Rubella dosis kedua' },
    { ageInMonths: 18, vaccineName: 'Polio booster', vaccineType: 'Polio', isOptional: false, sortOrder: 3, isActive: true, description: 'Polio booster' },
]

// Sample MPASI recipes data
const MPASI_RECIPES_DATA = [
    {
        name: 'Bubur Beras Putih',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Beras putih', amount: '2 sdm', unit: 'sendok makan' },
            { name: 'Air', amount: '200 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Cuci beras hingga bersih',
            'Masak beras dengan air hingga menjadi bubur',
            'Saring bubur hingga halus',
            'Sajikan dalam suhu hangat'
        ],
        nutrition: {
            calories: 45,
            protein: 1.2,
            carbohydrates: 9.8,
            fat: 0.1,
            fiber: 0.2
        },
        imageUrl: null
    },
    {
        name: 'Puree Pisang',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Pisang matang', amount: '1 buah', unit: 'buah' },
            { name: 'ASI atau susu formula', amount: '2 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Kupas pisang dan potong kecil-kecil',
            'Haluskan pisang dengan garpu',
            'Tambahkan ASI atau susu formula',
            'Aduk hingga tekstur halus'
        ],
        nutrition: {
            calories: 89,
            protein: 1.1,
            carbohydrates: 22.8,
            fat: 0.3,
            fiber: 2.6
        },
        imageUrl: null
    },
    {
        name: 'Bubur Ayam Wortel',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Daging ayam tanpa kulit', amount: '25 gram', unit: 'gram' },
            { name: 'Wortel', amount: '25 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Rebus ayam hingga empuk, suwir halus',
            'Potong wortel kecil-kecil',
            'Masak beras, ayam, dan wortel dengan air hingga menjadi bubur',
            'Haluskan sesuai tekstur yang diinginkan'
        ],
        nutrition: {
            calories: 95,
            protein: 8.2,
            carbohydrates: 12.5,
            fat: 1.8,
            fiber: 1.2
        },
        imageUrl: null
    },
    {
        name: 'Finger Food Kentang Kukus',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Kentang', amount: '100 gram', unit: 'gram' },
            { name: 'Keju parut', amount: '1 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Kupas dan potong kentang bentuk stick',
            'Kukus kentang hingga empuk',
            'Taburi keju parut di atas kentang',
            'Sajikan sebagai finger food'
        ],
        nutrition: {
            calories: 87,
            protein: 2.8,
            carbohydrates: 17.5,
            fat: 1.2,
            fiber: 2.2
        },
        imageUrl: null
    }
]

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