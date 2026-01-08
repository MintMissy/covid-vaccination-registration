import { PrismaClient } from '@prisma/client';

export async function seedClinics(prisma: PrismaClient) {
  console.log('Seeding clinics...');

  const clinics = [
    {
      name: 'Centrum Medyczne Warszawa',
      address: 'ul. Marszałkowska 1',
      city: 'Warszawa',
      postalCode: '00-001',
      phone: '+48 22 123 4567',
      email: 'warszawa@clinic.pl',
      capacityPerDay: 50,
    },
    {
      name: 'Przychodnia Kraków',
      address: 'ul. Floriańska 10',
      city: 'Kraków',
      postalCode: '31-019',
      phone: '+48 12 345 6789',
      email: 'krakow@clinic.pl',
      capacityPerDay: 30,
    },
    {
      name: 'Szpital Gdańsk',
      address: 'ul. Długi Targ 5',
      city: 'Gdańsk',
      postalCode: '80-828',
      phone: '+48 58 123 4567',
      email: 'gdansk@clinic.pl',
      capacityPerDay: 40,
    },
    {
      name: 'Klinika Wrocław',
      address: 'ul. Rynek 15',
      city: 'Wrocław',
      postalCode: '50-101',
      phone: '+48 71 234 5678',
      email: 'wroclaw@clinic.pl',
      capacityPerDay: 35,
    },
  ];

  for (const clinicData of clinics) {
    const existing = await prisma.clinic.findFirst({
      where: { name: clinicData.name },
    });

    if (!existing) {
      await prisma.clinic.create({ data: clinicData });
    }
  }

  console.log(`✓ Created ${clinics.length} clinics`);
}
