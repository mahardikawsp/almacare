-- CreateIndex
CREATE INDEX "children_userId_idx" ON "public"."children"("userId");

-- CreateIndex
CREATE INDEX "children_birthDate_idx" ON "public"."children"("birthDate");

-- CreateIndex
CREATE INDEX "children_userId_createdAt_idx" ON "public"."children"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "growth_records_childId_idx" ON "public"."growth_records"("childId");

-- CreateIndex
CREATE INDEX "growth_records_childId_date_idx" ON "public"."growth_records"("childId", "date");

-- CreateIndex
CREATE INDEX "growth_records_date_idx" ON "public"."growth_records"("date");

-- CreateIndex
CREATE INDEX "immunization_records_childId_idx" ON "public"."immunization_records"("childId");

-- CreateIndex
CREATE INDEX "immunization_records_status_idx" ON "public"."immunization_records"("status");

-- CreateIndex
CREATE INDEX "immunization_records_scheduledDate_idx" ON "public"."immunization_records"("scheduledDate");

-- CreateIndex
CREATE INDEX "immunization_records_childId_status_idx" ON "public"."immunization_records"("childId", "status");

-- CreateIndex
CREATE INDEX "mpasi_menu_plans_childId_idx" ON "public"."mpasi_menu_plans"("childId");

-- CreateIndex
CREATE INDEX "mpasi_menu_plans_date_idx" ON "public"."mpasi_menu_plans"("date");

-- CreateIndex
CREATE INDEX "mpasi_recipes_ageRangeMin_ageRangeMax_idx" ON "public"."mpasi_recipes"("ageRangeMin", "ageRangeMax");

-- CreateIndex
CREATE INDEX "mpasi_recipes_texture_idx" ON "public"."mpasi_recipes"("texture");

-- CreateIndex
CREATE INDEX "mpasi_recipes_ageRangeMin_texture_idx" ON "public"."mpasi_recipes"("ageRangeMin", "texture");
