import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir archivos estáticos
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/proyectos', express.static(path.join(__dirname, 'proyectos')));
app.use('/', express.static(__dirname));

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
