-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK_MORNING', 'SNACK_AFTERNOON');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "mpasi_menu_plans" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mpasi_menu_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mpasi_meals" (
    "id" TEXT NOT NULL,
    "menuPlanId" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "recipeId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mpasi_meals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mpasi_menu_plans_childId_date_key" ON "mpasi_menu_plans"("childId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "mpasi_meals_menuPlanId_mealType_key" ON "mpasi_meals"("menuPlanId", "mealType");

-- AddForeignKey
ALTER TABLE "mpasi_menu_plans" ADD CONSTRAINT "mpasi_menu_plans_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mpasi_meals" ADD CONSTRAINT "mpasi_meals_menuPlanId_fkey" FOREIGN KEY ("menuPlanId") REFERENCES "mpasi_menu_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mpasi_meals" ADD CONSTRAINT "mpasi_meals_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "mpasi_recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
