export default class Header {
    constructor({
        welcomeContainer,
        btnLoginDialog,
        btnLogout
    }) {
        this.welcomeContainer = welcomeContainer;
        this.btnLoginDialog = btnLoginDialog;
        this.btnLogout = btnLogout;
    }

    displayCurrentUser(user) {
        if (user) {
            this.welcomeContainer?.classList.add("isLogged");
            this.btnLoginDialog?.classList.add("isLogged")
            this.btnLogout?.classList.add("isLogged");
            document.getElementById("current-user").innerHTML = user.name;
        }
    }

    removeCurrentUser() {
        this.welcomeContainer?.classList.remove("isLogged");
        this.btnLoginDialog?.classList.remove("isLogged")
        this.btnLogout?.classList.remove("isLogged");
        document.getElementById("current-user").innerHTML = "";
    }
}