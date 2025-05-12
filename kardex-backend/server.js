/**const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());

app.post('/analyze', upload.single('kardex'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const materias = [];
    const resumen = {
      Aprobadas: 0,
      Reprobadas: 0,
      EnCurso: 0,
      Pendientes: 0,
      Promedio: null
    };

    const aprobadas = [];
    const lineas = text.split('\n').map(l => l.trim());
    let seccion = '';

    for (let linea of lineas) {
      if (linea.includes('MATERIAS CURSADAS')) {
        seccion = 'cursadas';
        continue;
      } else if (linea.includes('MATERIAS CURSANDO')) {
        seccion = 'cursando';
        continue;
      } else if (linea.includes('MATERIAS POR CURSAR')) {
        seccion = 'por_cursar';
        continue;
      }

      // --- MATERIAS CURSADAS ---
      if (seccion === 'cursadas') {
        const match = linea.match(/^([A-Z0-9]{6,})\s+(.+?)(\d{1,2})\s+\d+\s+\d+\s+\S+\s+(\d{2,3}|EXC)\d?$/);
        if (match) {
          const [_, code, rawName, credit, rawScore] = match;
          const name = rawName.trim();
          const score = rawScore === 'EXC' ? 100 : parseInt(rawScore);
          const status = score >= 70 ? 'Aprobada' : 'Reprobada';
          materias.push({ code, name, status, score });
          resumen[status === 'Aprobada' ? 'Aprobadas' : 'Reprobadas']++;
          if (status === 'Aprobada') aprobadas.push(score);
        }
      }

      // --- MATERIAS CURSANDO ---
      if (seccion === 'cursando') {
        const match = linea.match(/^([A-Z0-9]{6,})\s+(.+?)\d{3}0$/);
        if (match) {
          const [_, code, name] = match;
          materias.push({ code, name: name.trim(), status: 'En curso', score: null });
          resumen.EnCurso++;
        }
      }

      // --- MATERIAS POR CURSAR ---
      if (seccion === 'por_cursar') {
        const match = linea.match(/^([A-Z0-9]{6,})\s+(.+?)\d{3}0$/);
        if (match) {
          const [_, code, name] = match;
          if (!materias.some(m => m.code === code)) {
            materias.push({ code, name: name.trim(), status: 'Pendiente', score: null });
            resumen.Pendientes++;
          }
        }
      }
    }

    if (aprobadas.length) {
      resumen.Promedio = parseFloat((aprobadas.reduce((a, b) => a + b, 0) / aprobadas.length).toFixed(2));
    }

    res.json({ materias, resumen });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing PDF');
  }
});

app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
**/