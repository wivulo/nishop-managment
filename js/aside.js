export default class Aside{

    constructor({asideBar, btnOpenAsidebar, btnCloseAsidebar, getHTMLFile}){
        this.asideBar = asideBar;
        this.btnOpenAside = btnOpenAsidebar;
        this.btnCloseAsidebar = btnCloseAsidebar;
        this.getHTMLFile = getHTMLFile;
    }

    init(){
        this.btnOpenAside?.addEventListener("click", this.openAsideBar.bind(this));

        this.btnCloseAsidebar?.addEventListener("click", this.closeAsideBar.bind(this));
    }

    openAsideBar(){
        const asideBar = document.getElementById("aside-bar");

        try{
            if(asideBar.classList.contains("close")){
                asideBar.classList.replace("close", "open");
            }else{
                asideBar.classList.add("open");
            }
        }catch(e){
            console.log(e);
        }
    }

    closeAsideBar(){
        const asideBar = document.getElementById("aside-bar");

        try{
            if(asideBar.classList.contains("open")){
                asideBar.classList.replace("open", "close");
            }else{
                asideBar.classList.add("close");
            }
        }catch(e){
            console.log(e);
        }
    }


}