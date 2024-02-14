export const create = (name, attibutes, children = undefined, innerText = undefined) => {
    const element = document.createElement(name);

    attibutes.map(attr => {
        Object.keys(attr).map(key => {
            element[key] = attr[key];
        });
    })

    if(children != undefined){
        if(typeof(children) == "string") element.innerHTML = children;
        else children.map(child => element.appendChild(child));
    }

    if(innerText != undefined) element.innerText = innerText;
    
    return element;
}