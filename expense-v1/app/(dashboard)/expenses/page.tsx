'use client';

import React, { useEffect, useState } from 'react';
import { expensesApi, categoriesApi } from '@/lib/api';
import { Expense, Category } from '@/types';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [filters]);

  const loadData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        expensesApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      const params: any = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.categoryId) params.categoryId = filters.categoryId;

      const response = await expensesApi.getAll(params);
      setExpenses(response.data);
    } catch (error) {
      showToast('Failed to load expenses', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormData({
      categoryId: categories[0]?.id || '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      categoryId: expense.category.id,
      amount: String(expense.amount),
      description: expense.description || '',
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        date: formData.date,
      };

      if (editingExpense) {
        await expensesApi.update(editingExpense.id, data);
        showToast('Expense updated successfully', 'success');
      } else {
        await expensesApi.create(data);
        showToast('Expense created successfully', 'success');
      }
      setIsModalOpen(false);
      loadExpenses();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expensesApi.delete(id);
      showToast('Expense deleted successfully', 'success');
      loadExpenses();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
        <Button onClick={openCreateModal} disabled={categories.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-6">
            <p className="text-amber-600 text-center">
              Please create at least one category before adding expenses.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-40"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-40"
            />
            <Select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              className="w-40"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ startDate: '', endDate: '', categoryId: '' })}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
        <span className="text-indigo-900 font-medium">
          Total: {expenses.length} expenses
        </span>
        <span className="text-2xl font-bold text-indigo-600">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Expenses List */}
      <Card>
        <CardContent className="pt-6">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses found</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900 text-lg">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <Input
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What was this expense for?"
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingExpense ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
