const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const filePath = path.join(__dirname, 'data', 'expenses.json')

const toPaise = (amount) => {
    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return null
    }

    const paise = Math.round(numericAmount * 100)

    return Number.isSafeInteger(paise) && paise > 0 ? paise : null
}

app.post('/expenses', (req, res) => {
    const newExpense = req.body

    if (newExpense.amount === undefined || newExpense.amount === null || newExpense.amount === '') {
        return res.status(400).json({ error: 'Amount is required' })
    }

    const amountInPaise = toPaise(newExpense.amount)

    if (!amountInPaise) {
        return res.status(400).json({ error: 'Amount must be a number greater than 0' })
    }

    if (!newExpense.category || !newExpense.category.trim()) {
        return res.status(400).json({ error: 'Category is required' })
    }

    if (!newExpense.description || !newExpense.description.trim()) {
        return res.status(400).json({ error: 'Description is required' })
    }

    if (!newExpense.date || isNaN(new Date(newExpense.date))) {
        return res.status(400).json({ error: 'Valid date is required' })
    }

    // Step 1: Read existing data
    let expenses = []

    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        expenses = data ? JSON.parse(data) : []
    } catch (err) {
        expenses = []
    }

    // Step 2: Check duplicate
    const existing = expenses.find(e => e.id === newExpense.id)

    if (existing) {
        return res.status(200).json(existing)
    }

    // Step 3: Add metadata
    const expenseToSave = {
        ...newExpense,
        amount: amountInPaise,
        created_at: new Date().toISOString()
    }

    // Step 4: Save
    expenses.push(expenseToSave)
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2))

    // Step 5: Return
    res.status(201).json(expenseToSave)
})





app.get('/expenses', (req, res) => {
    let expenses = []

    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        expenses = data ? JSON.parse(data) : []
    } catch (err) {
        expenses = []
    }

    // 🔍 Filter by category
    if (req.query.category) {
        expenses = expenses.filter(
            (e) => e.category === req.query.category
        )
    }

    // 🔽 Sort by date (newest first)
    if (req.query.sort === 'date_desc') {
        expenses.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        )
    }

    res.json(expenses)
})







app.listen(3001, () => {
    console.log('Server running on port 3001')
})
