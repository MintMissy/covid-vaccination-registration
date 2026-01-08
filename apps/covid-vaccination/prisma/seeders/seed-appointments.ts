import { PrismaClient, AppointmentStatus } from '@prisma/client';

export async function seedAppointments(prisma: PrismaClient) {
  console.log('Seeding appointments...');

  const patients = await prisma.patient.findMany();
  const clinics = await prisma.clinic.findMany();
  const doctors = await prisma.doctor.findMany();

  if (patients.length === 0 || clinics.length === 0) {
    throw new Error(
      'Patients and clinics required. Run seed-patients and seed-clinics first.',
    );
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const appointments = [
    {
      patientId: patients[0].id,
      clinicId: clinics[0].id,
      doctorId: doctors[0]?.id || null,
      appointmentDate: tomorrow,
      status: AppointmentStatus.SCHEDULED,
      doseNumber: 1,
      notes: 'First dose appointment',
    },
    {
      patientId: patients[1].id,
      clinicId: clinics[0].id,
      doctorId: doctors[0]?.id || null,
      appointmentDate: nextWeek,
      status: AppointmentStatus.SCHEDULED,
      doseNumber: 2,
      notes: 'Second dose appointment',
    },
    {
      patientId: patients[2].id,
      clinicId: clinics[1]?.id || clinics[0].id,
      doctorId: doctors[1]?.id || doctors[0]?.id || null,
      appointmentDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      status: AppointmentStatus.COMPLETED,
      doseNumber: 1,
      notes: 'Completed appointment',
    },
    {
      patientId: patients[3].id,
      clinicId: clinics[2]?.id || clinics[0].id,
      doctorId: null,
      appointmentDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: AppointmentStatus.SCHEDULED,
      doseNumber: 1,
      notes: 'Future appointment',
    },
    {
      patientId: patients[4].id,
      clinicId: clinics[0].id,
      doctorId: null,
      appointmentDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: AppointmentStatus.CANCELLED,
      doseNumber: 1,
      notes: 'Cancelled appointment',
    },
  ];

  for (const appointmentData of appointments) {
    const existing = await prisma.appointment.findFirst({
      where: {
        patientId: appointmentData.patientId,
        appointmentDate: appointmentData.appointmentDate,
      },
    });

    if (!existing) {
      await prisma.appointment.create({ data: appointmentData });
    }
  }

  console.log(`✓ Created ${appointments.length} appointments`);
}
