import { PrismaClient } from '@prisma/client';

export async function seedPatients(prisma: PrismaClient) {
  console.log('Seeding patients...');

  const patients = [
    {
      pesel: '90010112345',
      firstName: 'Jan',
      lastName: 'Kowalski',
      dateOfBirth: new Date('1990-01-01'),
      email: 'jan.kowalski@example.com',
      phone: '+48 500 100 200',
      address: 'ul. Marszałkowska 10',
      city: 'Warszawa',
      postalCode: '00-001',
    },
    {
      pesel: '85020223456',
      firstName: 'Anna',
      lastName: 'Nowak',
      dateOfBirth: new Date('1985-02-02'),
      email: 'anna.nowak@example.com',
      phone: '+48 501 200 300',
      address: 'ul. Floriańska 20',
      city: 'Kraków',
      postalCode: '31-019',
    },
    {
      pesel: '92030334567',
      firstName: 'Piotr',
      lastName: 'Wiśniewski',
      dateOfBirth: new Date('1992-03-03'),
      email: 'piotr.wisniewski@example.com',
      phone: '+48 502 300 400',
      address: 'ul. Długi Targ 15',
      city: 'Gdańsk',
      postalCode: '80-828',
    },
    {
      pesel: '88040445678',
      firstName: 'Maria',
      lastName: 'Dąbrowska',
      dateOfBirth: new Date('1988-04-04'),
      email: 'maria.dabrowska@example.com',
      phone: '+48 503 400 500',
      address: 'ul. Rynek 25',
      city: 'Wrocław',
      postalCode: '50-101',
    },
    {
      pesel: '95050556789',
      firstName: 'Tomasz',
      lastName: 'Lewandowski',
      dateOfBirth: new Date('1995-05-05'),
      email: 'tomasz.lewandowski@example.com',
      phone: '+48 504 500 600',
      address: 'ul. Marszałkowska 30',
      city: 'Warszawa',
      postalCode: '00-001',
    },
    {
      pesel: '87060667890',
      firstName: 'Katarzyna',
      lastName: 'Wójcik',
      dateOfBirth: new Date('1987-06-06'),
      email: 'katarzyna.wojcik@example.com',
      phone: '+48 505 600 700',
      address: 'ul. Floriańska 40',
      city: 'Kraków',
      postalCode: '31-019',
    },
  ];

  for (const patientData of patients) {
    const existing = await prisma.patient.findUnique({
      where: { pesel: patientData.pesel },
    });

    if (!existing) {
      await prisma.patient.create({ data: patientData });
    }
  }

  console.log(`✓ Created ${patients.length} patients`);
}
