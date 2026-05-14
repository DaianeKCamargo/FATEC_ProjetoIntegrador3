const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log("✅ Conectado no banco"))
  .catch(err => console.error("❌ Erro no banco:", err));

module.exports = client;