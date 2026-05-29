export async function createCollectionPoint(data: any) {
    return fetch("http://localhost:3000/pontos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function create(arg0: { nameUser: string; cpfUser: string; celUser: string; emailUser: string; linkPhoto: string; namePoint: string; cnpjPoint: string; opensDay: string; hourInit: string; hourFinal: string; address: { street: string; number: string; complement: string; district: string; city: string; postCode: string; }; }) {
    throw new Error("Function not implemented.");
}
