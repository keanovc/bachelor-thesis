import { calculateMonthAndYear } from './calculateMonthAndYear'
import { calculateDateRange } from './calculateDateRange'

export const calculateBudgets = (budgets, count, type) => {
    const filteredBudgets = budgets.filter(budget => {
        if (budget.type === type) {
            if (budget.monthly) {
                const dateRange = calculateDateRange(budget.startDate, budget.endDate)
                if (dateRange.includes((calculateMonthAndYear(count).dateMonthAndYear))) {
                    return budget
                }
            } else {
                if (budget.date === calculateMonthAndYear(count).dateMonthAndYear) {
                    return budget
                }
            }
        }
    })
    
    const budgetsArray = filteredBudgets.map(budget => budget.money)
    const budgetsTotal = budgetsArray.reduce((a, b) => a + b, 0)
    return budgetsTotal
}