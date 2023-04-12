export const setRightCurrency = (user, amount) => {
    return user.symbolBefore ? user.symbol + " " + amount : amount + " " + user.symbol
}