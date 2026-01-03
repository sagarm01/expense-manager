import { IsOptional, IsDateString, IsUUID } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
