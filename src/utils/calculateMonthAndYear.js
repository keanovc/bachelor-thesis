import { getFormatedDate } from 'react-native-modern-datepicker'

export const calculateMonthAndYear = (count = 0) => {
    const datePreviousMonth = new Date()
    datePreviousMonth.setMonth(datePreviousMonth.getMonth() - count)
    if (datePreviousMonth.getMonth() === 0) {
        datePreviousMonth.setFullYear(datePreviousMonth.getFullYear() - 1)
        datePreviousMonth.setMonth(12)
    }

    const dateMonthAndYear = getFormatedDate(datePreviousMonth).toString().substring(0, 4) + " " + getFormatedDate(datePreviousMonth).toString().substring(5, 7)
    
    return { datePreviousMonth, dateMonthAndYear }
}