import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/seed-users';
import { seedClinics } from './seeders/seed-clinics';
import { seedDoctors } from './seeders/seed-doctors';
import { seedPatients } from './seeders/seed-patients';
import { seedVaccines } from './seeders/seed-vaccines';
import { seedAppointments } from './seeders/seed-appointments';
import { seedVaccinations } from './seeders/seed-vaccinations';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedUsers(prisma);
    await seedClinics(prisma);
    await seedDoctors(prisma);
    await seedPatients(prisma);
    await seedVaccines(prisma);
    await seedAppointments(prisma);
    await seedVaccinations(prisma);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📋 Test users:');
    console.log('  Admin:  admin@example.com / password123');
    console.log('  Staff:  staff@example.com / password123');
    console.log('  Doctor: doctor@example.com / password123');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
