import { getFormatedDate } from 'react-native-modern-datepicker'

export const calculateDateRange = (startDate = "2023 04", endDate = "2028 08") => {
    const startYear = parseInt(startDate.substring(0, 4))
    const startMonth = parseInt(startDate.substring(5, 7))
    const endYear = parseInt(endDate.substring(0, 4))
    const endMonth = parseInt(endDate.substring(5, 7))

    const dateRange = []

    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === startYear && month < startMonth) {
                continue
            }

            if (year === endYear && month > endMonth) {
                continue
            }

            const date = year + " " + (month < 10 ? "0" + month : month)
            dateRange.push(date)
        }
    }

    return dateRange
}