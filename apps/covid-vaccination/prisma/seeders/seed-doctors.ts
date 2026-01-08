import { PrismaClient, UserRole } from '@prisma/client';

export async function seedDoctors(prisma: PrismaClient) {
  console.log('Seeding doctors...');

  const doctorUsers = await prisma.user.findMany({
    where: { role: UserRole.DOCTOR },
  });

  if (doctorUsers.length === 0) {
    throw new Error('Doctor users not found. Run seed-users first.');
  }

  const clinics = await prisma.clinic.findMany();
  if (clinics.length === 0) {
    throw new Error('No clinics found. Run seed-clinics first.');
  }

  const doctors = [
    {
      userId: doctorUsers[0].id,
      clinicId: clinics[0].id,
      licenseNumber: 'DOC-001',
      specialization: 'Internal Medicine',
    },
    {
      userId: doctorUsers[1]?.id || doctorUsers[0].id,
      clinicId: clinics[1]?.id || clinics[0].id,
      licenseNumber: 'DOC-002',
      specialization: 'Family Medicine',
    },
  ];

  for (const doctorData of doctors) {
    const existing = await prisma.doctor.findUnique({
      where: { licenseNumber: doctorData.licenseNumber },
    });

    if (!existing) {
      await prisma.doctor.create({ data: doctorData });
    }
  }

  console.log(`✓ Created ${doctors.length} doctors`);
}
