'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'

type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

type ExpenseForm = {
  amount: string
  category: string
  description: string
  date: string
}

const emptyForm: ExpenseForm = {
  amount: '',
  category: '',
  description: '',
  date: ''
}

const normalizeCategory = (category: string) => category.trim().toLowerCase()
const expensesUrl = 'http://localhost:3001/expenses'
const formatCurrency = (amountInPaise: number) =>
  (amountInPaise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  })

const fetchExpenses = async () => {
  const res = await fetch(expensesUrl)

  if (!res.ok) {
    throw new Error('Failed to fetch expenses')
  }

  const data: Expense[] = await res.json()

  return data
}

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortOrder, setSortOrder] = useState<'none' | 'date_desc'>('none')
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])
  const [form, setForm] = useState<ExpenseForm>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    Promise.resolve().then(async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchExpenses()

        if (!ignore) {
          setAllExpenses(data)
        }
      } catch {
        if (!ignore) {
          setError('Failed to load expenses. Please try again.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const expenses = useMemo(() => {
    let filtered = [...allExpenses]

    if (categoryFilter) {
      filtered = filtered.filter(
        expense => normalizeCategory(expense.category) === categoryFilter
      )
    }

    if (sortOrder === 'date_desc') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }

    return filtered
  }, [categoryFilter, sortOrder, allExpenses])

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    return totals
  }, {})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'category' ? normalizeCategory(value) : value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!form.amount || !form.category || !form.description || !form.date) {
      alert('Please fill all fields')
      return
    }

    const amountInPaise = Math.round(Number(form.amount) * 100)

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      alert('Amount must be greater than 0 with up to 2 decimal places')
      return
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...form,
      amount: amountInPaise,
      category: normalizeCategory(form.category)
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(expensesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      })

      if (!res.ok) {
        throw new Error('Failed to add expense')
      }

      setForm(emptyForm)
      setAllExpenses(await fetchExpenses())
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    ...new Set(
      allExpenses
        .map(expense => normalizeCategory(expense.category))
        .filter(Boolean)
    )
  ]

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        </header>

        <section className="flex flex-col gap-3 sm:flex-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:flex-1"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setSortOrder(sortOrder === 'none' ? 'date_desc' : 'none')
            }
            className={`rounded px-4 py-2 font-medium shadow-sm transition sm:w-auto ${sortOrder === 'date_desc'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
              }`}
          >
            {sortOrder === 'date_desc'
              ? 'Sorted by Date (Newest)'
              : 'Sort by Date'}
          </button>
        </section>

        <section>
          <form onSubmit={handleSubmit} className="space-y-3 rounded bg-white p-4 shadow">
            <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            <button disabled={isSubmitting} className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto">
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </section>

        <section className="space-y-3">
          {isLoading && <p className="text-gray-600">Loading...</p>}

          {error && <p className="text-red-600">{error}</p>}

          {!isLoading && !error && (
            <>
              <p className="font-bold text-gray-900">
                Total: {formatCurrency(total)}
              </p>

              <div className="rounded bg-white p-4 shadow">
                <h2 className="mb-2 font-semibold text-gray-900">Category Summary</h2>

                {Object.entries(categoryTotals).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm text-gray-700">
                    <span>{category}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>

              
              {expenses.length === 0 && (
                <p className="text-gray-500">No expenses yet</p>
              )}

              {expenses.map(expense => (
                <div key={expense.id} className="rounded bg-white p-4 shadow">
                  <p className="font-semibold text-gray-900">
                    {expense.description}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatCurrency(expense.amount)} | {expense.category} | {expense.date}
                  </p>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
