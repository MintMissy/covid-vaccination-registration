import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const hashedPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const passwordHash = await hashedPassword('password123');

  const users = [
    {
      email: 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
    {
      email: 'staff@example.com',
      passwordHash,
      role: UserRole.STAFF,
      firstName: 'Staff',
      lastName: 'User',
      isActive: true,
    },
    {
      email: 'doctor@example.com',
      passwordHash,
      role: UserRole.DOCTOR,
      firstName: 'Doctor',
      lastName: 'User',
      isActive: true,
    },
    {
      email: 'doctor2@example.com',
      passwordHash,
      role: UserRole.DOCTOR,
      firstName: 'Doctor',
      lastName: 'Smith',
      isActive: true,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  console.log(`✓ Created ${users.length} users`);
}
