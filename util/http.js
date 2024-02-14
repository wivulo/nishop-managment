export async function httpGET(url){
    return fetch(url, {
        method: "GET",
    }).then(res => res.json())
    .catch(e => console.log(e));
}