import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getMonthlyAnalytics(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all expenses for the month
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Daily breakdown
    const dailyMap = new Map<string, number>();
    expenses.forEach((exp) => {
      const dateKey = exp.date.toISOString().split('T')[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + Number(exp.amount));
    });

    const dailyBreakdown = Array.from(dailyMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));

    // Category breakdown
    const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
    expenses.forEach((exp) => {
      const existing = categoryMap.get(exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        categoryMap.set(exp.categoryId, {
          name: exp.category.name,
          color: exp.category.color,
          amount: Number(exp.amount),
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([id, data]) => ({
      categoryId: id,
      categoryName: data.name,
      color: data.color,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }));

    return {
      year,
      month,
      total,
      expenseCount: expenses.length,
      dailyBreakdown,
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
    };
  }

  async getYearlyAnalytics(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Monthly breakdown
    const monthlyMap = new Map<number, number>();
    for (let i = 1; i <= 12; i++) {
      monthlyMap.set(i, 0);
    }
    expenses.forEach((exp) => {
      const month = exp.date.getMonth() + 1;
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + Number(exp.amount));
    });

    const monthlyBreakdown = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      monthName: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' }),
      amount,
    }));

    // Category breakdown
    const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
    expenses.forEach((exp) => {
      const existing = categoryMap.get(exp.categoryId);
      if (existing) {
        existing.amount += Number(exp.amount);
      } else {
        categoryMap.set(exp.categoryId, {
          name: exp.category.name,
          color: exp.category.color,
          amount: Number(exp.amount),
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([id, data]) => ({
      categoryId: id,
      categoryName: data.name,
      color: data.color,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }));

    return {
      year,
      total,
      expenseCount: expenses.length,
      monthlyBreakdown,
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
      averageMonthly: total / 12,
    };
  }

  async getDashboardSummary(userId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // This month
    const thisMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const thisMonthEnd = new Date(currentYear, currentMonth, 0);

    // Last month
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0);

    const [thisMonthExpenses, lastMonthExpenses, recentExpenses, thisMonthCount] = await Promise.all([
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: thisMonthStart, lte: thisMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { amount: true },
      }),
      this.prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
      }),
      this.prisma.expense.count({
        where: {
          userId,
          date: { gte: thisMonthStart, lte: thisMonthEnd },
        },
      }),
    ]);

    const thisMonthTotal = Number(thisMonthExpenses._sum.amount) || 0;
    const lastMonthTotal = Number(lastMonthExpenses._sum.amount) || 0;

    return {
      thisMonth: {
        total: thisMonthTotal,
        count: thisMonthCount,
      },
      lastMonth: {
        total: lastMonthTotal,
      },
      comparison: {
        difference: thisMonthTotal - lastMonthTotal,
        percentageChange: lastMonthTotal > 0
          ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
          : 0,
      },
      recentExpenses,
    };
  }
}
