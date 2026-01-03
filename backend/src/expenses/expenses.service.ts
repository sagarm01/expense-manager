import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: FilterExpenseDto) {
    const where: any = { userId };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        categoryId: createExpenseDto.categoryId,
        amount: createExpenseDto.amount,
        description: createExpenseDto.description,
        date: new Date(createExpenseDto.date),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    const data: any = { ...updateExpenseDto };
    if (updateExpenseDto.date) {
      data.date = new Date(updateExpenseDto.date);
    }

    return this.prisma.expense.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
