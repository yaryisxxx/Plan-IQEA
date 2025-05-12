from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import io
import re

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_kardex():
    if 'kardex' not in request.files:
        return 'No file uploaded', 400

    file = request.files['kardex']
    pdf_bytes = file.read()

    materias = []
    resumen = {
        'Aprobadas': 0,
        'Reprobadas': 0,
        'EnCurso': 0,
        'Pendientes': 0,
        'Promedio': None
    }

    aprobadas = []

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        text = ''
        for i in range(len(pdf.pages)):
            page = pdf.pages[i]
            page_text = page.extract_text() or ''
            text += '\n' + page_text

    # Dividir en secciones
    if 'MATERIAS CURSADAS' in text:
        partes = re.split(r'MATERIAS CURSADAS|MATERIAS CURSANDO|MATERIAS POR CURSAR', text)
        cursadas_txt = partes[1] if len(partes) > 1 else ''
        cursando_txt = partes[2] if len(partes) > 2 else ''
        por_cursar_txt = partes[3] if len(partes) > 3 else ''

        # CURSADAS
        for linea in cursadas_txt.split('\n'):
            match = re.match(r'^([A-Z0-9]{6,})\s+(.+?)\s+(\d{1,2})\s+\d+\s+\S+\s+(\d{2,3}|EXC)', linea)
            if match:
                code, name, credit, score = match.groups()
                score = 100 if score == 'EXC' else int(score)
                status = 'Aprobada' if score >= 70 else 'Reprobada'
                materias.append({
                    'code': code,
                    'name': name.strip(),
                    'status': status,
                    'score': score
                })
                resumen[status] += 1
                if status == 'Aprobada':
                    aprobadas.append(score)

        # CURSANDO
        for linea in cursando_txt.split('\n'):
            match = re.match(r'^([A-Z0-9]{6,})\s+(.+?)\d{3}0$', linea)
            if match:
                code, name = match.groups()
                materias.append({
                    'code': code,
                    'name': name.strip(),
                    'status': 'En curso',
                    'score': None
                })
                resumen['EnCurso'] += 1

        # POR CURSAR
        for linea in por_cursar_txt.split('\n'):
            match = re.match(r'^([A-Z0-9]{6,})\s+(.+?)\d{3}0$', linea)
            if match:
                code, name = match.groups()
                materias.append({
                    'code': code,
                    'name': name.strip(),
                    'status': 'Pendiente',
                    'score': None
                })
                resumen['Pendientes'] += 1

    if aprobadas:
        resumen['Promedio'] = round(sum(aprobadas) / len(aprobadas), 2)

    return jsonify({
        'materias': materias,
        'resumen': resumen
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)
