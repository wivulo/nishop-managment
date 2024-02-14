export const stringToObject = (value) => {
    const obj = {};

    const strArray = value.split("&");
    strArray.map(str => {
        let tmp = str.split("=");
        obj[tmp[0]] = tmp[1]
    })

    return obj;
}