export const addZero = (num: number) => num < 10 ? `0${num}` : num

export const createDateKey = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${addZero(month)}-${addZero(day)}`
}
