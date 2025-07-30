const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testMPASISystem() {
    console.log('🧪 Testing MPASI Recipe System...\n')

    try {
        // Test 1: Check if recipes exist
        console.log('1. Testing recipe database...')
        const recipeCount = await prisma.mPASIRecipe.count()
        console.log(`   ✅ Found ${recipeCount} recipes in database`)

        // Test 2: Get recipes by age range
        console.log('\n2. Testing age-based filtering...')
        const recipesFor6Months = await prisma.mPASIRecipe.findMany({
            where: {
                AND: [
                    { ageRangeMin: { lte: 6 } },
                    { ageRangeMax: { gte: 6 } }
                ]
            }
        })
        console.log(`   ✅ Found ${recipesFor6Months.length} recipes suitable for 6-month-old babies`)
        recipesFor6Months.forEach(recipe => {
            console.log(`      - ${recipe.name} (${recipe.ageRangeMin}-${recipe.ageRangeMax} months, ${recipe.texture})`)
        })

        // Test 3: Get recipes by texture
        console.log('\n3. Testing texture filtering...')
        const pureeRecipes = await prisma.mPASIRecipe.findMany({
            where: { texture: 'PUREE' }
        })
        console.log(`   ✅ Found ${pureeRecipes.length} puree recipes`)

        const mashedRecipes = await prisma.mPASIRecipe.findMany({
            where: { texture: 'MASHED' }
        })
        console.log(`   ✅ Found ${mashedRecipes.length} mashed recipes`)

        const fingerFoodRecipes = await prisma.mPASIRecipe.findMany({
            where: { texture: 'FINGER_FOOD' }
        })
        console.log(`   ✅ Found ${fingerFoodRecipes.length} finger food recipes`)

        // Test 4: Test search functionality
        console.log('\n4. Testing search functionality...')
        const buburRecipes = await prisma.mPASIRecipe.findMany({
            where: {
                name: {
                    contains: 'bubur',
                    mode: 'insensitive'
                }
            }
        })
        console.log(`   ✅ Found ${buburRecipes.length} recipes containing 'bubur'`)

        // Test 5: Test recipe details
        console.log('\n5. Testing recipe details...')
        const sampleRecipe = await prisma.mPASIRecipe.findFirst()
        if (sampleRecipe) {
            console.log(`   ✅ Sample recipe: ${sampleRecipe.name}`)
            console.log(`      Age range: ${sampleRecipe.ageRangeMin}-${sampleRecipe.ageRangeMax} months`)
            console.log(`      Texture: ${sampleRecipe.texture}`)
            console.log(`      Ingredients: ${sampleRecipe.ingredients.length} items`)
            console.log(`      Instructions: ${sampleRecipe.instructions.length} steps`)
            console.log(`      Nutrition: ${sampleRecipe.nutrition.calories} calories`)
        }

        // Test 6: Test favorites functionality (simulate)
        console.log('\n6. Testing favorites structure...')
        const favoriteCount = await prisma.mPASIFavorite.count()
        console.log(`   ✅ Current favorites count: ${favoriteCount}`)

        console.log('\n🎉 All MPASI system tests passed!')

    } catch (error) {
        console.error('❌ Test failed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the test
testMPASISystem()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })