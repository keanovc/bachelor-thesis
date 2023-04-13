import { calculateMonthAndYear } from './calculateMonthAndYear'

export const calculateBudgets = (budgets, count, type) => {
    const filteredBudgets = budgets.filter(budget => (budget.date === calculateMonthAndYear(count).dateMonthAndYear || budget.monthly === true) && budget.type === type)
    const budgetsArray = filteredBudgets.map(budget => budget.money)
    const budgetsTotal = budgetsArray.reduce((a, b) => a + b, 0)
    return budgetsTotal
}