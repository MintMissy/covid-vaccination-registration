import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PatientsModule } from '../patients/patients.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { VaccinationsModule } from '../vaccinations/vaccinations.module';
import { ClinicsModule } from '../clinics/clinics.module';
import { ExternalApiModule } from '../external/external-api.module';
import { HealthController } from '../health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    PatientsModule,
    AppointmentsModule,
    VaccinationsModule,
    ClinicsModule,
    ExternalApiModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
