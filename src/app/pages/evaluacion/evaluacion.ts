import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { doc, setDoc, updateDoc } from '@angular/fire/firestore';


interface Pregunta {
  id: string;
  pregunta: string;
  respuesta: number | null;
}

@Component({
  selector: 'app-evaluacion-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, DividerModule],
  providers: [MessageService],
  template: `
<div class="p-6 md:p-10 bg-surface-50 dark:bg-surface-900 min-h-screen">
  <h2 class="text-4xl font-bold text-center text-primary mb-10">Evaluación Docente</h2>

  <div class="mb-10 max-w-xl mx-auto">
    <label class="block text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Selecciona un profesor:</label>
    <p-dropdown
      [options]="profesores"
      [(ngModel)]="profesorSeleccionado"
      placeholder="Selecciona un profesor"
      optionLabel="label"
      class="w-full text-lg"
      styleClass="p-dropdown-lg"
    />
  </div>

  <div *ngIf="profesorSeleccionado" class="space-y-8 max-w-5xl mx-auto">
    <div
      *ngFor="let pregunta of preguntas; let i = index"
      class="p-6 rounded-2xl shadow-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
    >
      <p class="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
        {{ i + 1 }}. {{ pregunta.pregunta }}
      </p>
      <div class="flex flex-wrap gap-6 text-base">
  <div *ngFor="let opcion of opciones" class="flex items-center gap-3">
    <p-radioButton
      name="pregunta{{ i }}"
      [value]="opcion.value"
      [(ngModel)]="pregunta.respuesta"
      [inputId]="'pregunta' + i + '_' + opcion.value"
      styleClass="p-radiobutton-lg"
    />
    <label [for]="'pregunta' + i + '_' + opcion.value" class="text-gray-800 dark:text-gray-200">
      {{ opcion.label }}
    </label>
  </div>
</div>
</div>
<div
  class="p-6 rounded-2xl shadow-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
>
  <p class="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
    51. Proporciona una reseña del maestro
  </p>
  <textarea
    [(ngModel)]="comentario"
    rows="4"
    placeholder="Escribe tus comentarios aquí..."
    class="w-full p-4 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
  ></textarea>
  </div>
    <div class="text-center pt-10">
      <button
        pButton
        type="button"
        label="Enviar Evaluación"
        icon="pi pi-check"
        class="p-button-rounded p-button-lg p-button-success text-lg px-6 py-3"
        (click)="enviar()"
      ></button>
    </div>
  


</div>
</div>
  `
})
export class EvaluacionDocenteComponent implements OnInit {
  profesores: { label: string, value: string }[] = [];
  profesorSeleccionado: string | null = null;
  preguntas: Pregunta[] = [];
  comentario: string = '';
formEnviado: boolean = false;

  constructor(
    private firestore: Firestore,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const profesoresRef = collection(this.firestore, 'Profesores');
      const snapshot = await getDocs(profesoresRef);

      if (snapshot.empty) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay profesores disponibles.' });
        return;
      }

      this.profesores = snapshot.docs.map(doc => ({
        label: doc.id,
        value: doc.id
      }));

      this.preguntas = this.obtenerPreguntas();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos.' });
      console.error(error);
    }
  }

  obtenerPreguntas(): Pregunta[] {
  const preguntas: Pregunta[] = [
    { id: 'pregunta1', pregunta: 'El docente explica claramente los temas.', respuesta: null },
    { id: 'pregunta2', pregunta: 'Utiliza ejemplos prácticos durante sus clases.', respuesta: null },
    { id: 'pregunta3', pregunta: 'Responde de manera clara a las dudas del grupo.', respuesta: null },
    { id: 'pregunta4', pregunta: 'Organiza bien el contenido del curso.', respuesta: null },
    { id: 'pregunta5', pregunta: 'Presenta los temas con profundidad y orden.', respuesta: null },
    { id: 'pregunta6', pregunta: 'Entrega un plan de trabajo al inicio del curso.', respuesta: null },
    { id: 'pregunta7', pregunta: 'Sigue el temario establecido.', respuesta: null },
    { id: 'pregunta8', pregunta: 'Utiliza recursos visuales o digitales en clase.', respuesta: null },
    { id: 'pregunta9', pregunta: 'Fomenta la participación del grupo.', respuesta: null },
    { id: 'pregunta10', pregunta: 'Relaciona los temas con casos reales o aplicables.', respuesta: null },
    { id: 'pregunta11', pregunta: 'Explica claramente cómo va a evaluar.', respuesta: null },
    { id: 'pregunta12', pregunta: 'Las evaluaciones corresponden a los temas impartidos.', respuesta: null },
    { id: 'pregunta13', pregunta: 'Entrega resultados de evaluaciones en un tiempo razonable.', respuesta: null },
    { id: 'pregunta14', pregunta: 'Brinda retroalimentación útil sobre trabajos y exámenes.', respuesta: null },
    { id: 'pregunta15', pregunta: 'Las tareas tienen criterios claros de evaluación.', respuesta: null },
    { id: 'pregunta16', pregunta: 'Califica con justicia.', respuesta: null },
    { id: 'pregunta17', pregunta: 'Ofrece oportunidades de recuperación.', respuesta: null },
    { id: 'pregunta18', pregunta: 'Valora el esfuerzo además del resultado.', respuesta: null },
    { id: 'pregunta19', pregunta: 'Usa distintos métodos de evaluación.', respuesta: null },
    { id: 'pregunta20', pregunta: 'La calificación refleja lo aprendido.', respuesta: null },
    { id: 'pregunta21', pregunta: 'El docente es respetuoso con el grupo.', respuesta: null },
    { id: 'pregunta22', pregunta: 'Fomenta un ambiente positivo y sin discriminación.', respuesta: null },
    { id: 'pregunta23', pregunta: 'Escucha opiniones sin burlarse ni desacreditar.', respuesta: null },
    { id: 'pregunta24', pregunta: 'Trata por igual a todos los estudiantes.', respuesta: null },
    { id: 'pregunta25', pregunta: 'Motiva al grupo a mejorar.', respuesta: null },
    { id: 'pregunta26', pregunta: 'Está dispuesto a escuchar sugerencias.', respuesta: null },
    { id: 'pregunta27', pregunta: 'Se expresa con lenguaje adecuado.', respuesta: null },
    { id: 'pregunta28', pregunta: 'Evita favoritismos.', respuesta: null },
    { id: 'pregunta29', pregunta: 'Controla el grupo con respeto y firmeza.', respuesta: null },
    { id: 'pregunta30', pregunta: 'Está dispuesto a dar asesorías fuera de clase.', respuesta: null },
    { id: 'pregunta31', pregunta: 'Llega puntualmente a clase.', respuesta: null },
    { id: 'pregunta32', pregunta: 'Cumple con todas sus sesiones programadas.', respuesta: null },
    { id: 'pregunta33', pregunta: 'Entrega el material necesario con anticipación.', respuesta: null },
    { id: 'pregunta34', pregunta: 'Reprograma clases perdidas de forma oportuna.', respuesta: null },
    { id: 'pregunta35', pregunta: 'Muestra interés por el aprendizaje del grupo.', respuesta: null },
    { id: 'pregunta36', pregunta: 'Da seguimiento a estudiantes con dificultades.', respuesta: null },
    { id: 'pregunta37', pregunta: 'Entrega calificaciones a tiempo.', respuesta: null },
    { id: 'pregunta38', pregunta: 'Cumple con los compromisos establecidos.', respuesta: null },
    { id: 'pregunta39', pregunta: 'Se mantiene actualizado en su área.', respuesta: null },
    { id: 'pregunta40', pregunta: 'Aprovecha bien el tiempo de clase.', respuesta: null },
    { id: 'pregunta41', pregunta: 'Utiliza tecnología de manera efectiva.', respuesta: null },
    { id: 'pregunta42', pregunta: 'Aplica estrategias didácticas innovadoras.', respuesta: null },
    { id: 'pregunta43', pregunta: 'Promueve la honestidad académica.', respuesta: null },
    { id: 'pregunta44', pregunta: 'Mantiene un comportamiento ético y profesional.', respuesta: null },
    { id: 'pregunta45', pregunta: 'Es coherente entre lo que exige y lo que hace.', respuesta: null },
    { id: 'pregunta46', pregunta: 'Es accesible fuera del aula para resolver dudas.', respuesta: null },
    { id: 'pregunta47', pregunta: 'Mantiene una actitud profesional constante.', respuesta: null },
    { id: 'pregunta48', pregunta: 'Considero que aprendí lo suficiente con este docente.', respuesta: null },
    { id: 'pregunta49', pregunta: 'Recomendaría a este docente a otros estudiantes.', respuesta: null },
    { id: 'pregunta50', pregunta: 'En general, estoy satisfecho con el desempeño del docente.', respuesta: null }
  ];
  return preguntas;
}
opciones = [
  { label: 'Totalmente en desacuerdo', value: 1 },
  { label: 'En desacuerdo', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'De acuerdo', value: 4 },
  { label: 'Totalmente de acuerdo', value: 5 }
];
 
  async enviar() {
    if (!this.profesorSeleccionado) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selecciona un profesor.' });
      return;
    }

    // Calcular promedio
    const respuestas = this.preguntas.map(p => p.respuesta);
    const respuestasValidas = respuestas.filter(r => r !== null);
    const promedio = respuestasValidas.reduce((sum, val) => sum + val, 0) / respuestasValidas.length;

    // Crear el documento de evaluación en Firestore
    const evaluacionRef = doc(collection(this.firestore, 'Evaluaciones'));
    
    // Definir el tipo de datos para el objeto evaluacionData
    const evaluacionData: { [key: string]: any } = {
      profesorId: this.profesorSeleccionado,
      comentario: this.comentario,
      promedio: promedio,
    };

    // Asignar dinámicamente las respuestas
    this.preguntas.forEach((pregunta, index) => {
      evaluacionData[`pregunta${index + 1}`] = pregunta.respuesta;
    });

    try {
      await setDoc(evaluacionRef, evaluacionData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: '¡Evaluación enviada exitosamente!' });
      console.log('Evaluación guardada:', evaluacionData);
      // Limpiar formulario si es necesario
      this.comentario = '';
      this.preguntas.forEach(p => p.respuesta = null);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la evaluación.' });
      console.error('Error guardando evaluación:', error);
    }
  }
}
