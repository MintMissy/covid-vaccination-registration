import { PrismaClient } from '@prisma/client';

export async function seedVaccines(prisma: PrismaClient) {
  console.log('Seeding vaccines...');

  const vaccines = [
    {
      name: 'Comirnaty',
      manufacturer: 'Pfizer-BioNTech',
      batchNumber: 'PF-2024-001',
      expiryDate: new Date('2025-12-31'),
      dosesRequired: 2,
      storageTemperature: '-70°C to -80°C',
    },
    {
      name: 'Spikevax',
      manufacturer: 'Moderna',
      batchNumber: 'MOD-2024-001',
      expiryDate: new Date('2025-11-30'),
      dosesRequired: 2,
      storageTemperature: '-25°C to -15°C',
    },
    {
      name: 'Vaxzevria',
      manufacturer: 'AstraZeneca',
      batchNumber: 'AZ-2024-001',
      expiryDate: new Date('2025-10-31'),
      dosesRequired: 2,
      storageTemperature: '2°C to 8°C',
    },
    {
      name: 'Janssen',
      manufacturer: 'Johnson & Johnson',
      batchNumber: 'JNJ-2024-001',
      expiryDate: new Date('2025-09-30'),
      dosesRequired: 1,
      storageTemperature: '2°C to 8°C',
    },
    {
      name: 'Comirnaty',
      manufacturer: 'Pfizer-BioNTech',
      batchNumber: 'PF-2024-002',
      expiryDate: new Date('2026-01-31'),
      dosesRequired: 2,
      storageTemperature: '-70°C to -80°C',
    },
  ];

  for (const vaccineData of vaccines) {
    const existing = await prisma.vaccine.findUnique({
      where: { batchNumber: vaccineData.batchNumber },
    });

    if (!existing) {
      await prisma.vaccine.create({ data: vaccineData });
    }
  }

  console.log(`✓ Created ${vaccines.length} vaccines`);
}
