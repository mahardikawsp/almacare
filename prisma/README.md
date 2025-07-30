# Database Setup - BayiCare App

This directory contains the Prisma schema and database configuration for the BayiCare application.

## Schema Overview

The database includes the following models:

### Core Models
- **User**: User accounts with Google OAuth integration
- **Account**: NextAuth.js account management
- **Session**: NextAuth.js session management
- **Child**: Child profiles (up to 5 per user)

### Growth Tracking
- **GrowthRecord**: Weight, height, head circumference with WHO Z-scores

### Immunization System
- **ImmunizationSchedule**: Master schedule based on Kemenkes RI guidelines
- **ImmunizationRecord**: Individual child immunization tracking

### MPASI (Complementary Feeding)
- **MPASIRecipe**: Age-appropriate recipes with nutrition info
- **MPASIFavorite**: User's favorite recipes per child

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database (development only)
npx prisma migrate reset
```

## Seeded Data

The database is automatically seeded with:

### Immunization Schedule (17 vaccines)
Based on Indonesian Ministry of Health (Kemenkes RI) guidelines:
- 0 months: HB-0 (Hepatitis B)
- 1 month: BCG + Polio 1
- 2 months: DPT-HB-Hib 1 + Polio 2 + Rotavirus 1
- 3 months: DPT-HB-Hib 2 + Polio 3 + Rotavirus 2
- 4 months: DPT-HB-Hib 3 + Polio 4 + Rotavirus 3
- 9 months: MR 1 + JE (optional)
- 18 months: DPT-HB-Hib booster + MR 2 + Polio booster

### MPASI Recipes (4 sample recipes)
- Bubur Beras Putih (6-8 months, PUREE)
- Puree Pisang (6-8 months, PUREE)
- Bubur Ayam Wortel (8-10 months, MASHED)
- Finger Food Kentang Kukus (10-12 months, FINGER_FOOD)

## Environment Variables

Make sure to set the following in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bayicare_db"
```

## Production Considerations

- Use connection pooling for production deployment
- Implement proper backup strategies
- Monitor database performance and optimize queries
- Consider read replicas for scaling