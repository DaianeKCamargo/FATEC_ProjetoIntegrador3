export async function createCollectionPoint(data: any) {
    return fetch("http://localhost:3000/pontos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}