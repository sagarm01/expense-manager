'use client';

import React, { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { DashboardSummary } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsApi.getDashboard();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!summary) {
    return <div>Failed to load dashboard</div>;
  }

  const isPositiveChange = summary.comparison.difference <= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summary.thisMonth.total.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summary.lastMonth.total.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.thisMonth.count}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">vs Last Month</p>
                <p className={`text-2xl font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? '-' : '+'}${Math.abs(summary.comparison.difference).toFixed(2)}
                </p>
              </div>
              <div className={`p-3 ${isPositiveChange ? 'bg-green-100' : 'bg-red-100'} rounded-xl`}>
                {isPositiveChange ? (
                  <TrendingDown className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
        </CardHeader>
        <CardContent>
          {summary.recentExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {summary.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.description || expense.category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.category.name} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${Number(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
