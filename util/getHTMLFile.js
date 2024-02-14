export async function getHtmlFile(url) {
    try {
        const res = await fetch(url);
        const html = await res.text();
        if(html.includes("Cannot GET")){
            return {error: "Component not found!"}
        }

        return html;
    } catch (error) {
        console.error('Error fetching HTML file:', error);
        throw error;
    }
}
