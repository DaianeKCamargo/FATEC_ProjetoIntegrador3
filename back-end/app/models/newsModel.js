// Proxy para microserviço de News (porta 5505)
const API_NEWS_URL = process.env.API_NEWS_URL || "http://localhost:5505/api/news";

async function makeRequest(method, path, body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_NEWS_URL}${path}`, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao comunicar com microserviço de News:`, error);
        throw error;
    }
}

async function listarNoticias() {
    return await makeRequest("GET", "");
}

async function buscarPorId(id) {
    const lista = await makeRequest("GET", "");
    return lista.find(n => n.id === Number(id));
}

async function criarNoticia(titulo, link, imagem) {
    return await makeRequest("POST", "", { titulo, link, imagem });
}

async function atualizarNoticia(id, dados) {
    return await makeRequest("PUT", `/${id}`, dados);
}

async function removerNoticia(id) {
    await makeRequest("DELETE", `/${id}`);
    return { message: "Notícia removida com sucesso" };
}

module.exports = {
    listarNoticias,
    buscarPorId,
    criarNoticia,
    atualizarNoticia,
    removerNoticia,
};