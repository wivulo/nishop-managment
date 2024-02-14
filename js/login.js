export default class Login {
    #User = null;

    constructor(
        {
            userProxy,
            loginDialog,
            btnOpenLoginDialog,
            btnCloseLoginDialog,
            btnLogin,
            btnLogout,
            loginForm,
            progress,
            isLoginInProgess,
            http
        }) {
        this.#User = userProxy;
        this.loginDialog = loginDialog;
        this.btnOpenLoginDialog = btnOpenLoginDialog;
        this.btnCloseLoginDialog = btnCloseLoginDialog;
        this.btnLogin = btnLogin;
        this.btnLogout = btnLogout;
        this.loginForm = loginForm;
        this.progress = progress;
        this.isLoginInProgess = isLoginInProgess;
        this.http = http;
    }

    storedUser(){
        const storedUser = sessionStorage.getItem("currentUser");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            this.#User.name = parsedUser.name;
            this.#User.username = parsedUser.username;
            this.#User.email = parsedUser.email;
            this.#User.password = parsedUser.password;
        }

        return (this.#User.username && this.#User.password) ? true : false;
    }

    init() {

        this.btnOpenLoginDialog?.addEventListener("click", this.openLoginDialog.bind(this));

        this.btnCloseLoginDialog?.addEventListener("click", this.closeLoginDialog.bind(this));

        this.btnLogin?.addEventListener("click", this.login.bind(this));

        this.btnLogout?.addEventListener("click", this.logout.bind(this));
    }

    openLoginDialog() {
        try {
            if (this.loginDialog.classList.contains("close")) {
                this.loginDialog.classList.replace("close", "open");
            } else {
                this.loginDialog.classList.add("open");
            }
        } catch (e) {
            console.log(e);
        }
    }

    closeLoginDialog() {
        try {
            if (this.loginDialog.classList.contains("open")) {
                this.loginDialog.classList.replace("open", "close");
            } else {
                this.loginDialog.classList.add("close");
            }

            this.clearFormFilds()
        } catch (e) {
            console.log(e);
        }
    }

    saveCurrentUser(user) {
        try {
            this.#User.name = user.name;
            this.#User.username = user.username;
            this.#User.email = user.email;
            this.#User.password = user.password;

            sessionStorage.setItem("currentUser", JSON.stringify(user));

        } catch (e) {
            console.log(e);
        }
    }

    async getUser(user) {
        await new Promise((res, rej) => setTimeout(() => res(true), 5000)); // delay 5s

        const data = await this.http("./data/data.json");
        const math = data.users ? data.users.filter(potential => potential.username === user.name && potential.password === user.password) : null;

        return math != null ? math.length > 0 ?
            { status: true, user: math[0] } :
            { status: false, user: null } :
            { status: false, user: null };
    }

    async login(e) {
        try {
            e.preventDefault();

            if (!this.#User.username && !this.#User.password) {
                const formData = this.loginForm;
                if (formData && formData?.username.value && formData?.password.value) {
                    const user = {
                        name: formData?.username.value,
                        password: formData?.password.value,
                    }

                    this.toggleBtnLoginContentDisplay(true);
                    const isLogged = await this.getUser(user);

                    if (isLogged.status) {
                        this.saveCurrentUser(isLogged.user);
                        this.toggleBtnLoginContentDisplay(false);
                        this.clearFormFilds();
                        this.closeLoginDialog()
                    } else {
                        this.toggleBtnLoginContentDisplay(false);
                        throw new Error("Username or Password is incorrect! Please try again.");
                    }
                } else {
                    if (!formData?.username.value && !formData?.password.value) 
                        throw new Error("Username and Password is required!");
                    if(!formData?.username.value) throw new Error("Username is required!");
                    if(!formData?.password.value) throw new Error("Password is required!");

                    throw new Error("Some thing went wrong! Please try again");
                }
            }
        } catch (e) {
            this.displayMessageError(e.message);
            this.hideMessageError();
        }

    }

    toggleBtnLoginContentDisplay(inProgress) {
        if (inProgress) {
            this.isLoginInProgess.setAttribute("style", "opacity: 0")

            if (this.progress?.classList.contains("complete"))
                this.progress?.classList.replace("complete", "inProgress");
            else
                this.progress?.classList.add("inProgress");

            this.btnLogin.setAttribute("disabled", "true");
        } else {
            this.progress?.classList.replace("inProgress", "complete");
            this.isLoginInProgess.setAttribute("style", "opacity: 1")
            this.btnLogin.setAttribute("disabled", "true");
            this.btnLogin.removeAttribute("disabled")
        }
    }

    displayMessageError(message) {
        const messageContainer = document.getElementById("message-content");
        if (messageContainer.classList.contains("hide"))
            messageContainer.classList.replace("hide", "show");
        else
            messageContainer.classList.add("show");

        document.getElementById("message").innerHTML = message
    }

    hideMessageError() {
        setTimeout(() => {
            document.getElementById("message-content").classList.replace("show", "hide");
            document.getElementById("message").innerHTML = "";
        }, 3000);
    }

    clearFormFilds() {
        // TODO: clear form input filds
    }

    logout() {
        delete this.#User.name;
        delete this.#User.username;
        delete this.#User.email;
        delete this.#User.password;
    }
}

// checkUser() {
//     if (sessionStorage.getItem("currentUser")) {
//         const user = JSON.parse(sessionStorage.getItem("currentUser"));
//         this.#User = {
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             password: user.password
//         }
//     }
// }