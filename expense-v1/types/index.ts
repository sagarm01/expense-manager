export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  _count?: {
    expenses: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  };
  createdAt: string;
}

export interface DashboardSummary {
  thisMonth: {
    total: number;
    count: number;
  };
  lastMonth: {
    total: number;
  };
  comparison: {
    difference: number;
    percentageChange: number;
  };
  recentExpenses: Expense[];
}

export interface MonthlyAnalytics {
  year: number;
  month: number;
  total: number;
  expenseCount: number;
  dailyBreakdown: { date: string; amount: number }[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface YearlyAnalytics {
  year: number;
  total: number;
  expenseCount: number;
  monthlyBreakdown: { month: number; monthName: string; amount: number }[];
  categoryBreakdown: CategoryBreakdown[];
  averageMonthly: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}
