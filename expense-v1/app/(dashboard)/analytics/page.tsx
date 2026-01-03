'use client';

import React, { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { MonthlyAnalytics, YearlyAnalytics } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ExpenseTrendChart } from '@/components/charts/ExpenseTrendChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewType = 'monthly' | 'yearly';

export default function AnalyticsPage() {
  const [view, setView] = useState<ViewType>('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [view, year, month]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (view === 'monthly') {
        const response = await analyticsApi.getMonthly(year, month);
        setMonthlyData(response.data);
      } else {
        const response = await analyticsApi.getYearly(year);
        setYearlyData(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (view === 'monthly') {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      setYear(year - 1);
    }
  };

  const handleNext = () => {
    if (view === 'monthly') {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      setYear(year + 1);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Insights into your spending patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setView('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={view === 'yearly' ? 'primary' : 'secondary'}
            onClick={() => setView('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold min-w-[200px] text-center">
              {view === 'monthly' ? `${monthName} ${year}` : year}
            </span>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : view === 'monthly' && monthlyData ? (
        <>
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${monthlyData.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {monthlyData.expenseCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(monthlyData.total / new Date(year, month, 0).getDate()).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Spending by Category</h2>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={monthlyData.categoryBreakdown} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Daily Spending</h2>
              </CardHeader>
              <CardContent>
                <ExpenseTrendChart data={monthlyData.dailyBreakdown} />
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown Table */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Category Breakdown</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.categoryBreakdown.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="flex-1 font-medium">{cat.categoryName}</span>
                    <span className="text-gray-600">{cat.percentage.toFixed(1)}%</span>
                    <span className="font-semibold w-24 text-right">
                      ${cat.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : yearlyData ? (
        <>
          {/* Yearly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${yearlyData.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {yearlyData.expenseCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-gray-600">Monthly Average</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${yearlyData.averageMonthly.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Spending by Category</h2>
              </CardHeader>
              <CardContent>
                <CategoryPieChart data={yearlyData.categoryBreakdown} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Monthly Spending</h2>
              </CardHeader>
              <CardContent>
                <MonthlyBarChart data={yearlyData.monthlyBreakdown} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
