// Comprehensive MPASI recipes data for Indonesian babies
export const MPASI_RECIPES_DATA = [
    // === PUREE (6-8 bulan) ===
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
        name: 'Puree Alpukat',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Alpukat matang', amount: '1/2 buah', unit: 'buah' },
            { name: 'ASI atau susu formula', amount: '1 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Ambil daging alpukat yang matang',
            'Haluskan dengan garpu',
            'Tambahkan ASI atau susu formula untuk konsistensi',
            'Aduk hingga halus dan creamy'
        ],
        nutrition: {
            calories: 160,
            protein: 2.0,
            carbohydrates: 8.5,
            fat: 14.7,
            fiber: 6.7
        },
        imageUrl: null
    },
    {
        name: 'Puree Ubi Jalar',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Ubi jalar orange', amount: '100 gram', unit: 'gram' },
            { name: 'Air matang', amount: '50 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Kukus ubi jalar hingga empuk',
            'Kupas dan haluskan dengan garpu',
            'Tambahkan air matang sedikit demi sedikit',
            'Saring hingga tekstur halus'
        ],
        nutrition: {
            calories: 86,
            protein: 1.6,
            carbohydrates: 20.1,
            fat: 0.1,
            fiber: 3.0
        },
        imageUrl: null
    },
    {
        name: 'Puree Labu Kuning',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Labu kuning', amount: '100 gram', unit: 'gram' },
            { name: 'Air matang', amount: '30 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Potong labu kuning, buang biji',
            'Kukus hingga empuk',
            'Haluskan dengan garpu',
            'Tambahkan air matang hingga konsistensi sesuai'
        ],
        nutrition: {
            calories: 26,
            protein: 1.0,
            carbohydrates: 6.5,
            fat: 0.1,
            fiber: 0.5
        },
        imageUrl: null
    },
    {
        name: 'Puree Pir',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Pir matang', amount: '1 buah', unit: 'buah' },
            { name: 'Air matang', amount: '2 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Kupas pir dan potong kecil',
            'Kukus pir hingga empuk',
            'Haluskan dengan garpu',
            'Tambahkan air matang jika perlu'
        ],
        nutrition: {
            calories: 57,
            protein: 0.4,
            carbohydrates: 15.2,
            fat: 0.1,
            fiber: 3.1
        },
        imageUrl: null
    },
    {
        name: 'Puree Apel',
        ageRangeMin: 6,
        ageRangeMax: 8,
        texture: 'PUREE',
        ingredients: [
            { name: 'Apel merah', amount: '1 buah', unit: 'buah' },
            { name: 'Air matang', amount: '50 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Kupas apel dan potong kecil',
            'Rebus apel dengan sedikit air hingga empuk',
            'Haluskan dengan blender atau garpu',
            'Saring jika perlu untuk tekstur yang halus'
        ],
        nutrition: {
            calories: 52,
            protein: 0.3,
            carbohydrates: 13.8,
            fat: 0.2,
            fiber: 2.4
        },
        imageUrl: null
    },

    // === MASHED (8-10 bulan) ===
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
        name: 'Bubur Ikan Salmon Brokoli',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Ikan salmon', amount: '30 gram', unit: 'gram' },
            { name: 'Brokoli', amount: '30 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' },
            { name: 'Minyak zaitun', amount: '1/2 sdt', unit: 'sendok teh' }
        ],
        instructions: [
            'Kukus ikan salmon hingga matang, suwir halus',
            'Potong brokoli kecil-kecil',
            'Masak beras dengan air hingga menjadi bubur',
            'Tambahkan salmon dan brokoli, masak hingga empuk',
            'Tambahkan minyak zaitun sebelum disajikan'
        ],
        nutrition: {
            calories: 125,
            protein: 12.5,
            carbohydrates: 11.8,
            fat: 4.2,
            fiber: 1.8
        },
        imageUrl: null
    },
    {
        name: 'Bubur Daging Sapi Bayam',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Daging sapi giling', amount: '25 gram', unit: 'gram' },
            { name: 'Bayam', amount: '30 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Masak daging sapi giling hingga matang',
            'Cuci bayam dan potong halus',
            'Masak beras dengan air hingga menjadi bubur',
            'Tambahkan daging sapi dan bayam',
            'Masak hingga semua bahan empuk dan tercampur'
        ],
        nutrition: {
            calories: 110,
            protein: 9.8,
            carbohydrates: 12.2,
            fat: 2.5,
            fiber: 1.5
        },
        imageUrl: null
    },
    {
        name: 'Bubur Tahu Tempe Wortel',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Tahu putih', amount: '25 gram', unit: 'gram' },
            { name: 'Tempe', amount: '20 gram', unit: 'gram' },
            { name: 'Wortel', amount: '25 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Potong tahu dan tempe kecil-kecil',
            'Potong wortel kecil-kecil',
            'Masak beras dengan air hingga menjadi bubur',
            'Tambahkan tahu, tempe, dan wortel',
            'Masak hingga semua empuk, haluskan sesuai tekstur'
        ],
        nutrition: {
            calories: 98,
            protein: 6.5,
            carbohydrates: 13.8,
            fat: 2.8,
            fiber: 2.1
        },
        imageUrl: null
    },
    {
        name: 'Bubur Hati Ayam Kentang',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Hati ayam', amount: '20 gram', unit: 'gram' },
            { name: 'Kentang', amount: '30 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Bersihkan hati ayam, rebus hingga matang',
            'Potong kentang kecil-kecil',
            'Masak beras dengan air hingga menjadi bubur',
            'Tambahkan hati ayam dan kentang yang sudah dihaluskan',
            'Masak hingga semua tercampur rata'
        ],
        nutrition: {
            calories: 105,
            protein: 8.5,
            carbohydrates: 14.2,
            fat: 2.1,
            fiber: 1.0
        },
        imageUrl: null
    },
    {
        name: 'Bubur Ikan Kakap Jagung Manis',
        ageRangeMin: 8,
        ageRangeMax: 10,
        texture: 'MASHED',
        ingredients: [
            { name: 'Beras putih', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Ikan kakap', amount: '30 gram', unit: 'gram' },
            { name: 'Jagung manis', amount: '30 gram', unit: 'gram' },
            { name: 'Air', amount: '250 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Kukus ikan kakap hingga matang, suwir halus',
            'Pipil jagung manis',
            'Masak beras dengan air hingga menjadi bubur',
            'Tambahkan ikan dan jagung manis',
            'Masak hingga jagung empuk dan tercampur rata'
        ],
        nutrition: {
            calories: 115,
            protein: 10.2,
            carbohydrates: 15.8,
            fat: 1.8,
            fiber: 1.5
        },
        imageUrl: null
    },

    // === FINGER FOOD (10-12 bulan) ===
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
    },
    {
        name: 'Finger Food Wortel Panggang',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Wortel', amount: '100 gram', unit: 'gram' },
            { name: 'Minyak zaitun', amount: '1 sdt', unit: 'sendok teh' }
        ],
        instructions: [
            'Potong wortel bentuk stick panjang',
            'Olesi dengan minyak zaitun',
            'Panggang dalam oven 180°C selama 20 menit',
            'Sajikan hangat sebagai finger food'
        ],
        nutrition: {
            calories: 45,
            protein: 1.0,
            carbohydrates: 9.6,
            fat: 4.5,
            fiber: 2.8
        },
        imageUrl: null
    },
    {
        name: 'Finger Food Brokoli Keju',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Brokoli', amount: '100 gram', unit: 'gram' },
            { name: 'Keju cheddar parut', amount: '2 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Potong brokoli menjadi floret kecil',
            'Kukus brokoli hingga empuk tapi masih renyah',
            'Taburi keju parut di atas brokoli hangat',
            'Biarkan keju meleleh sedikit sebelum disajikan'
        ],
        nutrition: {
            calories: 55,
            protein: 5.2,
            carbohydrates: 5.8,
            fat: 2.1,
            fiber: 2.6
        },
        imageUrl: null
    },
    {
        name: 'Finger Food Tahu Goreng Mini',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Tahu putih', amount: '100 gram', unit: 'gram' },
            { name: 'Minyak untuk menggoreng', amount: '1 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Potong tahu menjadi stick kecil',
            'Panaskan sedikit minyak di wajan',
            'Goreng tahu hingga kecoklatan di luar',
            'Tiriskan dan sajikan hangat'
        ],
        nutrition: {
            calories: 95,
            protein: 8.1,
            carbohydrates: 2.3,
            fat: 6.2,
            fiber: 0.4
        },
        imageUrl: null
    },
    {
        name: 'Finger Food Pisang Panggang',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Pisang matang', amount: '1 buah', unit: 'buah' },
            { name: 'Kayu manis bubuk', amount: '1/4 sdt', unit: 'sendok teh' }
        ],
        instructions: [
            'Potong pisang menjadi stick',
            'Taburi dengan kayu manis bubuk',
            'Panggang dalam oven 180°C selama 10 menit',
            'Sajikan hangat sebagai finger food'
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
        name: 'Finger Food Telur Dadar Mini',
        ageRangeMin: 10,
        ageRangeMax: 12,
        texture: 'FINGER_FOOD',
        ingredients: [
            { name: 'Telur ayam', amount: '1 butir', unit: 'butir' },
            { name: 'Bayam cincang halus', amount: '1 sdm', unit: 'sendok makan' },
            { name: 'Minyak untuk menggoreng', amount: '1 sdt', unit: 'sendok teh' }
        ],
        instructions: [
            'Kocok telur dengan bayam cincang',
            'Panaskan minyak di wajan kecil',
            'Tuang adonan telur, buat dadar tipis',
            'Potong menjadi strip untuk finger food'
        ],
        nutrition: {
            calories: 78,
            protein: 6.3,
            carbohydrates: 0.6,
            fat: 5.3,
            fiber: 0.2
        },
        imageUrl: null
    },

    // === FAMILY FOOD (12+ bulan) ===
    {
        name: 'Nasi Tim Ayam Sayuran',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Beras putih', amount: '4 sdm', unit: 'sendok makan' },
            { name: 'Daging ayam cincang', amount: '40 gram', unit: 'gram' },
            { name: 'Wortel potong dadu', amount: '30 gram', unit: 'gram' },
            { name: 'Buncis potong kecil', amount: '20 gram', unit: 'gram' },
            { name: 'Air kaldu ayam', amount: '300 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Cuci beras dan masukkan ke dalam mangkuk tahan panas',
            'Tambahkan ayam cincang dan sayuran',
            'Tuang kaldu ayam',
            'Tim selama 45 menit hingga nasi empuk',
            'Aduk rata sebelum disajikan'
        ],
        nutrition: {
            calories: 145,
            protein: 12.5,
            carbohydrates: 18.2,
            fat: 3.1,
            fiber: 1.8
        },
        imageUrl: null
    },
    {
        name: 'Sup Ayam Makaroni',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Makaroni', amount: '50 gram', unit: 'gram' },
            { name: 'Daging ayam suwir', amount: '40 gram', unit: 'gram' },
            { name: 'Wortel potong dadu', amount: '30 gram', unit: 'gram' },
            { name: 'Kaldu ayam', amount: '400 ml', unit: 'mililiter' },
            { name: 'Daun seledri cincang', amount: '1 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Rebus makaroni hingga empuk, tiriskan',
            'Panaskan kaldu ayam',
            'Masukkan ayam suwir dan wortel',
            'Masak hingga wortel empuk',
            'Tambahkan makaroni dan daun seledri',
            'Masak 5 menit lagi, sajikan hangat'
        ],
        nutrition: {
            calories: 165,
            protein: 14.2,
            carbohydrates: 22.5,
            fat: 2.8,
            fiber: 1.5
        },
        imageUrl: null
    },
    {
        name: 'Perkedel Kentang Mini',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Kentang', amount: '200 gram', unit: 'gram' },
            { name: 'Telur ayam', amount: '1 butir', unit: 'butir' },
            { name: 'Daun bawang cincang', amount: '1 sdm', unit: 'sendok makan' },
            { name: 'Minyak untuk menggoreng', amount: '2 sdm', unit: 'sendok makan' }
        ],
        instructions: [
            'Rebus kentang hingga empuk, haluskan',
            'Campur kentang dengan telur dan daun bawang',
            'Bentuk adonan menjadi bulatan kecil',
            'Goreng hingga kecoklatan',
            'Tiriskan dan sajikan'
        ],
        nutrition: {
            calories: 125,
            protein: 4.2,
            carbohydrates: 18.8,
            fat: 4.5,
            fiber: 2.1
        },
        imageUrl: null
    },
    {
        name: 'Tumis Tahu Tempe Sayuran',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Tahu potong dadu', amount: '50 gram', unit: 'gram' },
            { name: 'Tempe potong dadu', amount: '50 gram', unit: 'gram' },
            { name: 'Buncis potong kecil', amount: '30 gram', unit: 'gram' },
            { name: 'Wortel potong dadu', amount: '30 gram', unit: 'gram' },
            { name: 'Minyak zaitun', amount: '1 sdm', unit: 'sendok makan' },
            { name: 'Air', amount: '50 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Panaskan minyak zaitun',
            'Tumis tahu dan tempe hingga kecoklatan',
            'Tambahkan sayuran dan air',
            'Masak hingga sayuran empuk',
            'Sajikan dengan nasi'
        ],
        nutrition: {
            calories: 155,
            protein: 12.8,
            carbohydrates: 8.5,
            fat: 9.2,
            fiber: 3.1
        },
        imageUrl: null
    },
    {
        name: 'Ikan Kukus Saus Tomat',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Ikan kakap fillet', amount: '60 gram', unit: 'gram' },
            { name: 'Tomat potong dadu', amount: '50 gram', unit: 'gram' },
            { name: 'Bawang bombay cincang', amount: '1 sdm', unit: 'sendok makan' },
            { name: 'Minyak zaitun', amount: '1 sdt', unit: 'sendok teh' },
            { name: 'Air', amount: '30 ml', unit: 'mililiter' }
        ],
        instructions: [
            'Kukus ikan hingga matang',
            'Panaskan minyak, tumis bawang bombay',
            'Tambahkan tomat dan air',
            'Masak hingga tomat empuk menjadi saus',
            'Siram saus di atas ikan kukus'
        ],
        nutrition: {
            calories: 135,
            protein: 18.5,
            carbohydrates: 4.2,
            fat: 4.8,
            fiber: 1.2
        },
        imageUrl: null
    },
    {
        name: 'Bubur Sumsum Gula Merah',
        ageRangeMin: 12,
        ageRangeMax: 24,
        texture: 'FAMILY_FOOD',
        ingredients: [
            { name: 'Tepung beras', amount: '3 sdm', unit: 'sendok makan' },
            { name: 'Santan encer', amount: '200 ml', unit: 'mililiter' },
            { name: 'Gula merah', amount: '2 sdm', unit: 'sendok makan' },
            { name: 'Garam', amount: '1/4 sdt', unit: 'sendok teh' }
        ],
        instructions: [
            'Larutkan tepung beras dengan sedikit santan',
            'Panaskan sisa santan',
            'Masukkan larutan tepung beras sambil diaduk',
            'Masak hingga mengental',
            'Tambahkan gula merah dan garam',
            'Aduk hingga gula larut'
        ],
        nutrition: {
            calories: 165,
            protein: 2.8,
            carbohydrates: 28.5,
            fat: 5.2,
            fiber: 0.5
        },
        imageUrl: null
    }
]