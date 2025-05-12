import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';
import { MateriaAlumno } from "./components/mat_alumno";
import { MateriasBajas } from "./components/mat_alumno_peor";
import { TopProfesoresWidget } from './components/topprofesores';
import { TopProfesorComentarioWidget } from './components/topcomentarios'; // Componente para comentarios

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MateriasBajas,
    MateriaAlumno,
    TopProfesoresWidget,
    TopProfesorComentarioWidget,
    CommonModule
  ],
  template: `
    <div class="grid grid-cols-12 gap-8">
      <!-- Widgets de materias -->
      <div class="col-span-12 xl:col-span-6">
        <app-top-grades-widget />
      </div>
      <div class="col-span-12 xl:col-span-6">
        <app-lowest-grades-widget />
      </div>

      <!-- Widget de mejores profesores (promedio general) -->
      <div class="col-span-12 xl:col-span-4">
        <app-top-profesores-widget />
      </div>

      <!-- Widgets individuales de comentarios -->
      <div class="col-span-12 xl:col-span-4" *ngIf="mejoresProfesores[0]">
        <app-top-profesor-comentario-widget [profesor]="mejoresProfesores[0]" />
      </div>
      <div class="col-span-12 xl:col-span-4" *ngIf="mejoresProfesores[1]">
        <app-top-profesor-comentario-widget [profesor]="mejoresProfesores[1]" />
      </div>
      <div class="col-span-12 xl:col-span-4" *ngIf="mejoresProfesores[2]">
        <app-top-profesor-comentario-widget [profesor]="mejoresProfesores[2]" />
      </div>
    </div>
  `
})
export class Dashboard implements OnInit {
  mejoresProfesores: { nombre: string; promedio: number; comentario: string }[] = [];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const colSnap = await getDocs(collection(this.firestore, 'Evaluaciones'));

    const profesores = colSnap.docs.map(doc => {
      const data = doc.data();
      
      // Extraemos los datos necesarios
      const profesorId = data['profesorId'];
      const nombreProfesor = profesorId?.label || 'Profesor desconocido';
      const promedio = parseFloat(Number(data['promedio']).toFixed(1)); // Redondeamos el promedio
      const comentario = data['comentario'] || 'Sin comentario';

      return {
        nombre: nombreProfesor,
        promedio: promedio,
        comentario: comentario
      };
    });

    // Filtramos los 3 mejores profesores
    this.mejoresProfesores = profesores
      .filter(p => !isNaN(p.promedio))  // Filtrar aquellos con promedio válido
      .sort((a, b) => b.promedio - a.promedio)  // Ordenar de mayor a menor
      .slice(0, 3);  // Obtener los primeros 3

    console.log('Mejores profesores:', this.mejoresProfesores); // Verificación
  }
}