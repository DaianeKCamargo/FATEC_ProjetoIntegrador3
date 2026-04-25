const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.listarNoticias = async () => {
  const result = await pool.query('SELECT * FROM noticias');
  return result.rows;
};

exports.criarNoticia = async (titulo, conteudo) => {
  const result = await pool.query(
    'INSERT INTO noticias (titulo, conteudo) VALUES ($1, $2) RETURNING *',
    [titulo, conteudo]
  );
  return result.rows[0];
};