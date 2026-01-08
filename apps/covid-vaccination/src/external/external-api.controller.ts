import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExternalApiService } from './external-api.service';

@ApiTags('external')
@Controller('external')
export class ExternalApiController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get('vaccine-statistics')
  @ApiOperation({
    summary: 'Get COVID-19 vaccine statistics from external API',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format (default: 2022-12-02)',
    example: '2022-12-02',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 502, description: 'External API server error' })
  @ApiResponse({ status: 503, description: 'External API unavailable' })
  @ApiResponse({ status: 429, description: 'External API rate limit exceeded' })
  async getVaccineStatistics(@Query('date') date?: string) {
    return this.externalApiService.getVaccineStatistics(date);
  }
}
