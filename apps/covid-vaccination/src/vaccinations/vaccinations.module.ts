import { Module } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { VaccinationsController } from './vaccinations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RepositoriesModule } from '../app/repositories.module';

@Module({
  imports: [PrismaModule, RepositoriesModule],
  controllers: [VaccinationsController],
  providers: [VaccinationsService],
  exports: [VaccinationsService],
})
export class VaccinationsModule {}
