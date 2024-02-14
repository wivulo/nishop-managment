export const isEmpty = (value) => {
    return value === null || value === undefined || value === "";
}

export const isNumber = (value) => {
    return !isNaN(value);
}