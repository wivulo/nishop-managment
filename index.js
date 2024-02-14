import Header from "./js/Header.js"
import Aside from "./js/aside.js"
import Login from "./js/login.js"
import { isLoggedIn } from "./js/auth.js";
import { httpGET } from "./util/http.js"
import { getHtmlFile } from "./util/getHTMLFile.js"
import { create } from "./util/createElement.js"
import { stringToObject } from "./util/stringToObject.js";
import { openModal } from "./js/modalActions.js";

const asideBar = document.getElementById("aside-bar");
const btnOpenAsideBar = document.getElementById("btn-open-asideBar");
const btnCloseAsideBar = document.getElementById("btn-close-asideBar");
const btnAddProduct = document.getElementById("add-product");

const loginDialog = document.getElementById("login-dialog");
const btnOpenLoginDialog = document.getElementById("btn-open-login-dialog");
const btnCloseLoginDialog = document.getElementById("btn-close-login-dialog");
const btnLogin = document.getElementById("btn-login");
const formLogin = document.getElementById("login-form");
const progressLogin = document.getElementById("progressLogin");
const isLoginInProgess = document.getElementById("logar");

const welcomeContainer = document.getElementById("Welcome");
const btnLogout = document.getElementById("btn-logout");

const section = document.getElementById("injectComponentHere");

const header = new Header({
    welcomeContainer: welcomeContainer,
    btnLoginDialog: btnOpenLoginDialog,
    btnLogout: btnLogout
});

const currentUser = {
    name: '',
    username: "",
    email: '',
    password: ""
};

const userProxyHandler = {
    set: function (obj, prop, valor) {
        // console.log(`Atribuindo valor ${valor} à propriedade: ${prop}`);

        if (prop === "password" && valor) {
            header.displayCurrentUser(obj);
        }

        obj[prop] = valor;

        return true;
    },
    deleteProperty: function (obj, prop) {
        console.log(`Removendo a propriedade: ${prop}`);

        delete obj[prop];

        if (prop === "password" && !obj[prop]) {
            header.removeCurrentUser();
        }

        return true;
    }
};

const userProxy = new Proxy(currentUser, userProxyHandler);

const aside = new Aside({
    asideBar,
    btnOpenAsideBar,
    btnCloseAsideBar,
    getHtmlFile: getHtmlFile
});
aside.init();

const login = new Login({
    userProxy: userProxy,
    loginDialog: loginDialog,
    btnOpenLoginDialog: btnOpenLoginDialog,
    btnCloseLoginDialog: btnCloseLoginDialog,
    btnLogin: btnLogin,
    btnLogout: btnLogout,
    loginForm: formLogin,
    progress: progressLogin,
    isLoginInProgess: isLoginInProgess,
    http: httpGET
});
login.init();


const mountComponent = (component, componentName) => {
    section.innerHTML = component;

    let script = create("script",
        [
            { src: `./component/${componentName}/${componentName}.js` },
            { type: "module" }
        ]);

    let style = create("link",
        [
            { rel: "stylesheet", href: `./component/${componentName}/${componentName}.css` }
        ]);

    document.head.appendChild(style);
    script && document.body.appendChild(script);
}


(async function () {
    const url = stringToObject(window.location.search.slice(1))

    if (!url.component) {
        const componentName = "overview";
        const component = await getHtmlFile(`./component/${componentName}/${componentName}.html`);
        mountComponent(component, componentName);
        return;
    } else {
        const componentName = url.component;
        const component = await getHtmlFile(`./component/${componentName}/${componentName}.html`);

        if (!component.error) {
            mountComponent(component, componentName);
        } else {
            const component = await getHtmlFile(`./component/notfound/notfound.html`);
            mountComponent(component, "notfound");
        }

        if(!url.action && url.component != "listproduct"){
            btnAddProduct.addEventListener("click", () => window.location.href = "?component=listproduct&action=addproduct");
        }
    }
})();

if (!isLoggedIn(userProxy)) {
    if(!login.storedUser()){
        openModal(loginDialog);
    }
}