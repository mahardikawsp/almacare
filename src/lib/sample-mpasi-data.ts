import { Texture } from '@prisma/client'
import { Ingredient, NutritionInfo } from '@/types'

export interface SampleMPASIRecipe {
    name: string
    ageRangeMin: number
    ageRangeMax: number
    texture: Texture
    ingredients: Ingredient[]
    instructions: string[]
    nutrition: NutritionInfo
    imageUrl?: string
}

export const sampleMPASIRecipes: SampleMPASIRecipe[] = [
    {
        name: 'Bubur Beras Putih Halus',
        ageRangeMin: 6,
        ageRangeMax: 7,
        texture: 'PUREE',
        ingredients: [
            { name: 'Beras putih', amount: '2', unit: 'sdm' },
            { name: 'Air matang', amount: '200', unit: 'ml' },
            { name: 'ASI atau susu formula', amount: '2', unit: 'sdm' }
        ],
        instructions: [
            'Cuci beras hingga bersih, kemudian rendam selama 30 menit',
            'Masak beras dengan air hingga menjadi bubur yang sangat lembut',
            'Saring bubur untuk mendapatkan tekstur yang halus',
            'Tambahkan ASI atau susu formula, aduk rata',
            'Sajikan dalam keadaan hangat'
        ],
        nutrition: {
            calories: 85,
            protein: 2.1,
            fat: 0.8,
            carbohydrates: 17.2,
            fiber: 0.3
        }
    },
    {
        name: 'Puree Pisang',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Pisang ambon matang', amount: '1', unit: 'buah' },
            { name: 'ASI atau susu formula', amount: '1-2', unit: 'sdm' }
        ],
        instructions: [
            'Pilih pisang yang matang dan manis',
            'Kupas pisang dan potong kecil-kecil',
            'Haluskan pisang dengan garpu atau blender',
            'Tambahkan ASI atau susu formula untuk mengencerkan jika perlu',
            'Sajikan segera setelah dibuat'
        ],
        nutrition: {
            calories: 95,
            protein: 1.2,
            fat: 0.3,
            carbohydrates: 24.7,
            fiber: 2.6,
            vitamins: { 'Vitamin C': 8.7, 'Vitamin B6': 0.4 },
            minerals: { 'Kalium': 358 }
        }
    },
    {
        name: 'Bubur Kentang Wortel',
        ageRangeMin: 7,
        ageRangeMax: 9,
        texture: 'PUREE',
        ingredients: [
            { name: 'Kentang', amount: '1', unit: 'buah sedang' },
            { name: 'Wortel', amount: '1', unit: 'buah kecil' },
            { name: 'Air matang', amount: '100', unit: 'ml' },
            { name: 'Minyak zaitun', amount: '1/2', unit: 'sdt' }
        ],
        instructions: [
            'Kupas kentang dan wortel, potong kecil-kecil',
            'Kukus kentang dan wortel hingga empuk (sekitar 15-20 menit)',
            'Haluskan dengan blender atau saringan',
            'Tambahkan air matang secukupnya untuk mendapatkan konsistensi yang diinginkan',
            'Tambahkan minyak zaitun, aduk rata',
            'Sajikan dalam keadaan hangat'
        ],
        nutrition: {
            calories: 120,
            protein: 2.8,
            fat: 2.1,
            carbohydrates: 24.5,
            fiber: 3.2,
            vitamins: { 'Vitamin A': 835, 'Vitamin C': 12.3 },
            minerals: { 'Kalium': 425 }
        }
    },
    {
        name: 'Bubur Ayam Sayuran',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3', unit: 'sdm' },
            { name: 'Daging ayam tanpa kulit', amount: '30', unit: 'gram' },
            { name: 'Wortel', amount: '1', unit: 'buah kecil' },
            { name: 'Bayam', amount: '3', unit: 'lembar' },
            { name: 'Air kaldu ayam', amount: '300', unit: 'ml' },
            { name: 'Minyak zaitun', amount: '1', unit: 'sdt' }
        ],
        instructions: [
            'Rebus ayam hingga empuk, ambil dagingnya dan suwir halus',
            'Masak beras dengan kaldu ayam hingga menjadi bubur',
            'Kukus wortel hingga empuk, potong kecil-kecil',
            'Rebus bayam sebentar, cincang halus',
            'Campurkan semua bahan ke dalam bubur',
            'Tambahkan minyak zaitun, aduk rata',
            'Sajikan hangat'
        ],
        nutrition: {
            calories: 165,
            protein: 8.5,
            fat: 4.2,
            carbohydrates: 22.8,
            fiber: 2.1,
            vitamins: { 'Vitamin A': 920, 'Vitamin C': 15.2 },
            minerals: { 'Zat Besi': 1.8, 'Kalsium': 45 }
        }
    },
    {
        name: 'Finger Food Kentang Panggang',
        ageRangeMin: 9,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Kentang', amount: '2', unit: 'buah sedang' },
            { name: 'Minyak zaitun', amount: '1', unit: 'sdt' },
            { name: 'Keju parut (opsional)', amount: '1', unit: 'sdm' }
        ],
        instructions: [
            'Panaskan oven hingga 200°C',
            'Kupas kentang dan potong memanjang seperti french fries',
            'Lumuri kentang dengan minyak zaitun',
            'Panggang selama 20-25 menit hingga empuk dan sedikit kecoklatan',
            'Taburi keju parut jika digunakan',
            'Biarkan dingin sebelum diberikan kepada bayi'
        ],
        nutrition: {
            calories: 140,
            protein: 3.2,
            fat: 2.8,
            carbohydrates: 28.5,
            fiber: 2.8,
            vitamins: { 'Vitamin C': 19.7 },
            minerals: { 'Kalium': 535 }
        }
    },
    {
        name: 'Nasi Tim Ikan Salmon',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '4', unit: 'sdm' },
            { name: 'Ikan salmon fillet', amount: '40', unit: 'gram' },
            { name: 'Brokoli', amount: '3', unit: 'kuntum' },
            { name: 'Air matang', amount: '250', unit: 'ml' },
            { name: 'Minyak zaitun', amount: '1', unit: 'sdt' }
        ],
        instructions: [
            'Cuci beras dan masak dengan air hingga menjadi nasi tim yang lembut',
            'Kukus ikan salmon hingga matang, suwir halus',
            'Kukus brokoli hingga empuk, cincang kecil',
            'Campurkan salmon dan brokoli ke dalam nasi tim',
            'Tambahkan minyak zaitun, aduk rata',
            'Sajikan hangat'
        ],
        nutrition: {
            calories: 185,
            protein: 12.5,
            fat: 6.8,
            carbohydrates: 20.2,
            fiber: 1.8,
            vitamins: { 'Vitamin D': 4.1, 'Vitamin C': 25.3 },
            minerals: { 'Omega-3': 1.2, 'Kalsium': 35 }
        }
    },
    {
        name: 'Bubur Kacang Hijau',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Kacang hijau', amount: '50', unit: 'gram' },
            { name: 'Santan encer', amount: '100', unit: 'ml' },
            { name: 'Air matang', amount: '200', unit: 'ml' },
            { name: 'Gula aren (sedikit)', amount: '1/2', unit: 'sdt' }
        ],
        instructions: [
            'Rendam kacang hijau selama 2 jam',
            'Rebus kacang hijau dengan air hingga empuk',
            'Haluskan kacang hijau yang sudah empuk',
            'Tambahkan santan encer, masak dengan api kecil',
            'Tambahkan sedikit gula aren untuk rasa',
            'Aduk hingga mengental, sajikan hangat'
        ],
        nutrition: {
            calories: 155,
            protein: 7.8,
            fat: 5.2,
            carbohydrates: 20.5,
            fiber: 4.1,
            vitamins: { 'Folat': 159 },
            minerals: { 'Zat Besi': 2.1, 'Magnesium': 48 }
        }
    },
    {
        name: 'Puree Alpukat',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Alpukat matang', amount: '1/2', unit: 'buah' },
            { name: 'ASI atau susu formula', amount: '1', unit: 'sdm' }
        ],
        instructions: [
            'Pilih alpukat yang matang dan lembut',
            'Belah alpukat dan ambil dagingnya',
            'Haluskan alpukat dengan garpu',
            'Tambahkan ASI atau susu formula untuk mengencerkan',
            'Aduk rata hingga tekstur halus',
            'Sajikan segera'
        ],
        nutrition: {
            calories: 160,
            protein: 2.0,
            fat: 14.7,
            carbohydrates: 8.5,
            fiber: 6.7,
            vitamins: { 'Vitamin K': 21, 'Folat': 81 },
            minerals: { 'Kalium': 485 }
        }
    }
]