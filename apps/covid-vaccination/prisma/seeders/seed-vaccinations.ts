import { AppointmentStatus, PrismaClient } from '@prisma/client';

export async function seedVaccinations(prisma: PrismaClient) {
  console.log('Seeding vaccinations...');

  const completedAppointments = await prisma.appointment.findMany({
    where: { status: AppointmentStatus.COMPLETED },
    include: { patient: true, clinic: true },
  });

  const vaccines = await prisma.vaccine.findMany();
  const doctors = await prisma.doctor.findMany();

  if (completedAppointments.length === 0) {
    console.log('⚠ No completed appointments found. Skipping vaccinations.');
    return;
  }

  if (vaccines.length === 0 || doctors.length === 0) {
    throw new Error(
      'Vaccines and doctors required. Run seed-vaccines and seed-doctors first.',
    );
  }

  const vaccinations: Array<{
    appointmentId: string;
    vaccineId: number;
    doctorId: string;
    administeredAt: Date;
    nextDoseDate: Date | null;
    sideEffects: string | null;
  }> = [];

  for (const appointment of completedAppointments) {
    const vaccine = vaccines[0];
    const doctor =
      doctors.find((d) => d.clinicId === appointment.clinicId) || doctors[0];

    const administeredDate = new Date(appointment.appointmentDate);
    const nextDoseDate = new Date(administeredDate);
    nextDoseDate.setDate(nextDoseDate.getDate() + 21);

    vaccinations.push({
      appointmentId: appointment.id,
      vaccineId: vaccine.id,
      doctorId: doctor.id,
      administeredAt: administeredDate,
      nextDoseDate:
        appointment.doseNumber < vaccine.dosesRequired ? nextDoseDate : null,
      sideEffects:
        appointment.doseNumber === 1 ? 'Mild soreness at injection site' : null,
    });
  }

  for (const vaccinationData of vaccinations) {
    await prisma.vaccination.upsert({
      where: { appointmentId: vaccinationData.appointmentId },
      update: {},
      create: vaccinationData,
    });
  }

  console.log(`✓ Created ${vaccinations.length} vaccinations`);
}
