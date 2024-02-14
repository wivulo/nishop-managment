import { currence } from "../../util/currence.js";

export const ProductListItem = (productIndex, product) => {
    return `
        <div class="flex w-5 justify-center">
            <input type="checkbox" id="product-${product.id}"/>
        </div>
        <div class="flex  items-center w-10 py-2">
            <img src="${product.imageSrc}" alt="${product.description}" width="60" height="60"/>
        </div>
        <div class="flex flex-col w-50 gap-5 pl-4">
            <p>${product.name}</p>
            <p class="product-description">${product.description}</p>
        </div>

        <div class="flex w-30 ">
            <p>${currence(product.price)}</p>
        </div>
    `
}