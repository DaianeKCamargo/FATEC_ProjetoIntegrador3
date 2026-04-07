const noticias = [];
let nextId = 1;

function listar() {
    return noticias;
}

function buscarPorId(id) {
    return noticias.find((item) => item.id === id);
}

function criar(dados) {
    const novaNoticia = {
        id: nextId++,
        titulo: dados.titulo || "",
        link: dados.link || "",
        imagem: dados.imagem || "",
    };
    noticias.push(novaNoticia);
    return novaNoticia;
}

function atualizar(id, dados) {
    const noticia = buscarPorId(id);
    if (!noticia) return null;

    noticia.titulo = dados.titulo ?? noticia.titulo;
    noticia.link = dados.link ?? noticia.link;
    noticia.imagem = dados.imagem ?? noticia.imagem;
    return noticia;
}

function remover(id) {
    const indice = noticias.findIndex((item) => item.id === id);
    if (indice === -1) return false;

    noticias.splice(indice, 1);
    return true;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};
