import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { VaccineCoverageResponse } from './dto/vaccine-coverage-response.dto';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  private readonly apiUrl = 'https://disease.sh/v3/covid-19';

  constructor(private httpService: HttpService) {}

  async getVaccineStatistics(date?: string) {
    try {
      const targetDate = date || '2022-12-02';

      const response = await firstValueFrom(
        this.httpService.get<VaccineCoverageResponse>(
          `${this.apiUrl}/vaccine/coverage/countries/Poland?lastdays=all`,
          {
            timeout: 10000,
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      );

      const data = response.data;
      const timeline = data.timeline || {};

      // Find the closest date to target date (or exact match)
      const targetDateObj = new Date(targetDate);
      let closestDate: string | null = null;
      let closestValue: number | null = null;
      let minDiff = Infinity;

      for (const [dateStr, value] of Object.entries(timeline)) {
        const dateObj = new Date(dateStr);
        const diff = Math.abs(dateObj.getTime() - targetDateObj.getTime());

        // Prefer exact match or closest date before target
        if (dateObj <= targetDateObj && diff < minDiff) {
          minDiff = diff;
          closestDate = dateStr;
          closestValue = value as number;
        }
      }

      const countryData = {
        country: 'Poland',
        totalVaccinations: closestValue || 0,
        date: closestDate || null,
      };

      return {
        source: 'external-api',
        timestamp: new Date().toISOString(),
        data: countryData,
      };
    } catch (error) {
      this.logger.error('External API error', error);

      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new HttpException(
            {
              statusCode: HttpStatus.SERVICE_UNAVAILABLE,
              message: 'External API timeout',
              error: 'Service Unavailable',
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        if (error.response && 'status' in error.response) {
          const status = error.response.status;

          if (status === 429) {
            throw new HttpException(
              {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'External API rate limit exceeded',
                error: 'Too Many Requests',
              },
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          if (status >= 500) {
            throw new HttpException(
              {
                statusCode: HttpStatus.BAD_GATEWAY,
                message: 'External API server error',
                error: 'Bad Gateway',
              },
              HttpStatus.BAD_GATEWAY,
            );
          }
        }
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'External API unavailable',
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
