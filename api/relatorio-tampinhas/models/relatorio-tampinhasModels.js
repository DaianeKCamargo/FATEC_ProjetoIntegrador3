const client = require('../../../lib/db');

// LISTAR
async function listar() {
    const result = await client.query(
        `SELECT id, data, quantidade_kg AS "quantidadeKg"
         FROM relatorio_tampinhas
         ORDER BY id ASC`
    );
    return result.rows;
}

// BUSCAR POR ID
async function buscarPorId(id) {
    const result = await client.query(
        `SELECT id, data, quantidade_kg AS "quantidadeKg"
         FROM relatorio_tampinhas
         WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

// CRIAR
async function criar(dados) {
    const result = await client.query(
        `INSERT INTO relatorio_tampinhas (data, quantidade_kg)
         VALUES ($1, $2)
         RETURNING id, data, quantidade_kg AS "quantidadeKg"`,
        [
            dados.data ? new Date(dados.data) : new Date(),
            Number(dados.quantidadeKg) || 0
        ]
    );
    return result.rows[0];
}

// ATUALIZAR
async function atualizar(id, dados) {
    const result = await client.query(
        `UPDATE relatorio_tampinhas
         SET 
            data = COALESCE($1, data),
            quantidade_kg = COALESCE($2, quantidade_kg)
         WHERE id = $3
         RETURNING id, data, quantidade_kg AS "quantidadeKg"`,
        [
            dados.data ? new Date(dados.data) : null,
            dados.quantidadeKg !== undefined ? Number(dados.quantidadeKg) : null,
            id
        ]
    );

    return result.rows[0] || null;
}

// REMOVER
async function remover(id) {
    const result = await client.query(
        'DELETE FROM relatorio_tampinhas WHERE id = $1',
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