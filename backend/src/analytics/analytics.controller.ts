import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('monthly')
  async getMonthlyAnalytics(
    @CurrentUser() user: { id: string },
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    @Query('month', new DefaultValuePipe(new Date().getMonth() + 1), ParseIntPipe) month: number,
  ) {
    return this.analyticsService.getMonthlyAnalytics(user.id, year, month);
  }

  @Get('yearly')
  async getYearlyAnalytics(
    @CurrentUser() user: { id: string },
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
  ) {
    return this.analyticsService.getYearlyAnalytics(user.id, year);
  }

  @Get('dashboard')
  async getDashboardSummary(@CurrentUser() user: { id: string }) {
    return this.analyticsService.getDashboardSummary(user.id);
  }
}
