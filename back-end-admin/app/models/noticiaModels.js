const db = require("../../lib/db");

async function listar() {
    const result = await db.query("SELECT * FROM noticias ORDER BY id");
    return result.rows;
}

async function buscarPorId(id) {
    const result = await db.query(
        "SELECT * FROM noticias WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

async function criar(dados) {
    const result = await db.query(
        "INSERT INTO noticias (titulo, link, imagem) VALUES ($1, $2, $3) RETURNING *",
        [dados.titulo, dados.link, dados.imagem]
    );
    return result.rows[0];
}

async function atualizar(id, dados) {
    const result = await db.query(
        `UPDATE noticias 
         SET titulo = $1, link = $2, imagem = $3
         WHERE id = $4
         RETURNING *`,
        [dados.titulo, dados.link, dados.imagem, id]
    );

    return result.rows[0];
}

async function remover(id) {
    const result = await db.query(
        "DELETE FROM noticias WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rowCount > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
};