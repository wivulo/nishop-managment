import { httpGET } from "../../util/http.js";
import { create } from "../../util/createElement.js";
import { moveElementToRight } from "../../js/animation.js";
import { closeModal, openModal } from "../../js/modalActions.js";
import { ProductListItem } from "./ProductListItem.js";
import { notification } from "../../js/notification.js";
import { stringToObject } from "../../util/stringToObject.js";
import { isEmpty, isNumber} from "../../util/validator.js";

const listContainerWrapper = document.getElementById("product-container");
const listContainer = document.getElementById("products");
const toEditModal = document.getElementById("modal-toEdit");
const toDeleteModal = document.getElementById("modal-toDelete");
const inputProductName = document.getElementById("product-name");
const inputProductdes = document.getElementById("product-description");
const inputProductPrice = document.getElementById("product-price");
const btnCloseToEditModal = document.getElementById("btn-close-toEdit-modal");
const btnConfirmToEditModal = document.getElementById("to-confirm-toEdit");
const btnCancelToEditModal = document.getElementById("btn-cancel-toEdit-modal");
const btnConfirmToDeleteModal = document.getElementById("btn-to-confirm-toDelete");
const btnCancelToDeleteModal = document.getElementById("btn-cancel-toDelete-modal");
const btnCloseToDeleteModal = document.getElementById("btn-close-toDelete-modal");
const btnToEdit = document.getElementById("toEdit-product");
const btnToDelete = document.getElementById("toDelete-product");
const addProductModal = document.getElementById("modal-add-Product");
const btnCloseAddProductModal = document.getElementById("btn-close-addProduct-modal");
const formAddProduct = document.getElementById("add-product-form");
// const btnSaveProduct = document.getElementById("btn-save-product");
const addProductMessageAlert = document.getElementById("add-product-message-alert");
const addProductMessageContent = document.getElementById("add-product-message-content");
const btnAddProduct = document.getElementById("add-product");

let product_id = [];
let productList = [];

const productListProxyHandler = {
    set: function (obj, prop, valor) {
        obj[prop] = valor;

        listProducts(prop, valor);

        return true;
    },
    get: function (obj, prop) {
        return obj[prop];
    },
    deleteProperty: function (obj, prop) {
        const productID = obj[prop].id;
        obj.splice(prop, 1);
        deleteProductInList(productID);
        return true;
    }
};


const productListProxy = new Proxy(productList, productListProxyHandler);

const listProducts = (productIndex, product) => {
    if (productIndex && product) {
        //check if product already exists in the list and update it
        if (document.getElementById(`${product.id}`)) {
            let productElement = document.getElementById(`${product.id}`);
            productElement.innerHTML = ProductListItem(productIndex, product);
            productElement.classList.remove("checked");
        } else {
            let productListItem = create("li", [{ id: product.id }], ProductListItem(productIndex, product));

            productListItem.classList.add("border-b", "border-gray-soft");

            listContainer.appendChild(productListItem);
        }

        const checkbox = document.getElementById(`product-${product.id}`);

        checkbox.addEventListener("click", e => {
            e.stopPropagation();
            if(e.target.checked){
                e.target.parentElement.parentElement.classList.add("checked");
                product.checked = true;
            }else{
                product.checked = false;
                e.target.parentElement.parentElement.classList.remove("checked")
            }
        });
    }
}

const deleteProductInList = (productID) => {
    let productElement = document.getElementById(`${productID}`);
    moveElementToRight(productElement, 1000, 500);
    setTimeout(() => {
        productElement.remove();
    }, 500);
    checkIfListIsEmpty();
}

(async () => {
    let data = await httpGET("../../data/data.json").catch(e => console.log(e));
    let productIndex = 0;
    data.product.map(async (product) => {
        productListProxy[productIndex++] = product;
    });
})()

//modal to edit
const fillInputOnToEditModal = (product) => {
    inputProductName.value = product.name;
    inputProductdes.value = product.description;
    inputProductPrice.value = product.price;
}

const handleOpenToEditModal = () => {
    product_id[0] = productListProxy.findIndex(product => product.checked === true);
    if (product_id[0] !== -1) {
        fillInputOnToEditModal(productListProxy[product_id[0]]);
        openModal(toEditModal);
    } else {
        notification.open("Please select a product to edit", "error");
        product_id = [];
    }
}

const handleSaveEditChanges = () => {
    if (inputProductName.value && inputProductdes.value && inputProductPrice.value) {
        productListProxy[product_id[0]] = {
            ...productListProxy[product_id[0]],
            name: inputProductName.value,
            description: inputProductdes.value,
            price: inputProductPrice.value
        }
    }

    closeModal(toEditModal);
    product_id = [];
}

btnToEdit.addEventListener("click", handleOpenToEditModal);
btnCloseToEditModal.addEventListener("click", () => closeModal(toEditModal));
btnCancelToEditModal.addEventListener("click", e => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel?")) {
        closeModal(toEditModal);
    }
})
btnConfirmToEditModal.addEventListener("click", handleSaveEditChanges);

//modal to delete
const handleOpenDeleteModal = () => {

    for (const p of productListProxy) {
        if (p && p.checked) {
            product_id.push(p.id);
            openModal(toDeleteModal);
        }
    }

    if(product_id.length === 0){
        notification.open("Please select a product to delete", "error");
        return;
    }
}

const handleDeleteProduct = (e) => {
    e.stopPropagation();
    product_id.map(id => {
        const productToDeleteID = productListProxy.findIndex(product => product.id === id);
        delete productListProxy[productToDeleteID];
    });
    closeModal(toDeleteModal);
    product_id = [];
}

btnToDelete.addEventListener("click", handleOpenDeleteModal);

btnCancelToDeleteModal.addEventListener("click", () => closeModal(toDeleteModal));
btnConfirmToDeleteModal.addEventListener("click", handleDeleteProduct);
btnCloseToDeleteModal.addEventListener("click", () => closeModal(toDeleteModal));

//Check if the list is empty
const checkIfListIsEmpty = () => {
    if (productListProxy.length === 0) {
        listContainer.innerHTML = 
        `<div class="w-full flex justify-center">
            <p class='text-center text-darkgray'>No product to show</p>
        </div>`;
    }
}

//Window events
window.onclick = function (event) {
    if (event.target == toDeleteModal) {
        closeModal(toDeleteModal);
    }
}

window.onclick = function (event) {
    if (event.target == toEditModal) {
        closetoEditModal();
    }
}

// Add product Modal
const url = stringToObject(window.location.search.slice(1));

if (url.action) {
   if(url.action === "addproduct"){
    openModal(addProductModal);
   }
}

const handlerSaveProduct = (e) => {
    e.preventDefault();

    const product = {
        id: productListProxy.length + 1,
        imageSrc: "../../" + formAddProduct.imageSrc.value,
        name: formAddProduct.name.value,
        price: formAddProduct.price.value,
        description: formAddProduct.description.value,
        colors: formAddProduct.colors.value,
        category: formAddProduct.category.value,
    }

    for(let key in product){
        if(key === "imageSrc" || key === "colors") continue;

        try {
            if(isEmpty(product[key])){
                throw new Error(`${key} is empty`);
            }

            if(key === "price" && !isNumber(product[key])){
                throw new Error("Price must be a number");
            }
    
        } catch (error) {
            addProductMessageContent.innerText = error.message;
            if(addProductMessageAlert.classList.contains("hide")){
                addProductMessageAlert.classList.replace("hide", "show");
            }else{
                addProductMessageAlert.classList.add("show");
            }

            setTimeout(() => addProductMessageAlert.classList.replace("show", "hide"), 2000);

            return;
        }
    }

    closeModal(addProductModal);

    listContainer.style.height = (listContainer.offsetHeight + 70) + "px";

    listContainerWrapper.scrollTo({
        top: listContainerWrapper.scrollHeight,
        behavior: "smooth"
    });
    

    setTimeout(() => {
        productListProxy[productListProxy.length] = product;
        listContainer.style.height = "auto";
    }, 1000);

}

formAddProduct.addEventListener("submit", handlerSaveProduct);
btnCloseAddProductModal.addEventListener("click", () => {
    closeModal(addProductModal)
})

btnAddProduct.addEventListener("click", () => {
    openModal(addProductModal);
})


