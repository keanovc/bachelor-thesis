export const setRightCurrency = (user, amount) => {
    const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    return user.symbolBefore 
    ? 
        user.symbol + " " + formattedAmount 
    : 
        formattedAmount + " " + user.symbol
}