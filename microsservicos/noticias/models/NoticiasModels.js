const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.listarNoticias = async () => {
  const result = await pool.query('SELECT * FROM noticias ORDER BY id DESC');
  return result.rows;
};

exports.buscarPorId = async (id) => {
  const result = await pool.query(
    'SELECT * FROM noticias WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

exports.criarNoticia = async (titulo, conteudo) => {
  const result = await pool.query(
    'INSERT INTO noticias (titulo, conteudo) VALUES ($1, $2) RETURNING *',
    [titulo, conteudo]
  );
  return result.rows[0];
};

exports.atualizarNoticia = async (id, titulo, conteudo) => {
  const result = await pool.query(
    'UPDATE noticias SET titulo = $1, conteudo = $2 WHERE id = $3 RETURNING *',
    [titulo, conteudo, id]
  );
  return result.rows[0];
};

exports.removerNoticia = async (id) => {
  await pool.query(
    'DELETE FROM noticias WHERE id = $1',
    [id]
  );
};