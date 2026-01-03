import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query() filters: FilterExpenseDto,
  ) {
    return this.expensesService.findAll(user.id, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.expensesService.findOne(id, user.id);
  }

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user.id, createExpenseDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, user.id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.expensesService.remove(id, user.id);
  }
}
