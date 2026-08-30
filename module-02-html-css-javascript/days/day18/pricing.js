export const withVat = (price) => {
    return price * 1.15;
};
export const format = (amount) => {
    return amount.toFixed(2);
};
export const total = (items) =>{
    return items.reduce((sum,{price,qty}) => {
        return sum + withVat(price) * qty;
    }, 0);
};