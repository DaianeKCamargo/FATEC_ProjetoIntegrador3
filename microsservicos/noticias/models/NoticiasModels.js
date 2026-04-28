const { Pool } = require('pg');
require('dotenv').config();

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

exports.criarNoticia = async (titulo, conteudo, url) => {
  const result = await pool.query(
    'INSERT INTO noticias (titulo, conteudo, url) VALUES ($1, $2, $3) RETURNING *',
    [titulo, conteudo, url]
  );
  return result.rows[0];
};

exports.atualizarNoticia = async (id, titulo, conteudo, url) => {
  const result = await pool.query(
    'UPDATE noticias SET titulo = $1, conteudo = $2, url = $3 WHERE id = $4 RETURNING *',
    [titulo, conteudo, url, id]
  );
  return result.rows[0];
};

exports.removerNoticia = async (id) => {
  await pool.query(
    'DELETE FROM noticias WHERE id = $1',
    [id]
  );
};