const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Crear tabla si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
  );
`).then(() => console.log('✅ Tabla alumnos lista'))
  .catch(err => console.error('❌ Error creando tabla:', err));

// Rutas CRUD
app.get('/api/alumnos', async (req, res) => {
  const result = await db.query('SELECT * FROM alumnos');
  res.json(result.rows);
});

app.get('/api/alumnos/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM alumnos WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

app.post('/api/alumnos', async (req, res) => {
  const { nombre, correo } = req.body;
  const result = await db.query(
    'INSERT INTO alumnos (nombre, correo) VALUES ($1, $2) RETURNING *',
    [nombre, correo]
  );
  res.json(result.rows[0]);
});

app.put('/api/alumnos/:id', async (req, res) => {
  const { nombre, correo } = req.body;
  const result = await db.query(
    'UPDATE alumnos SET nombre = $1, correo = $2 WHERE id = $3 RETURNING *',
    [nombre, correo, req.params.id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/alumnos/:id', async (req, res) => {
  await db.query('DELETE FROM alumnos WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
