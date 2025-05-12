import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-lowest-grades-widget',
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="font-semibold text-xl mb-6">Calificaciones Más Bajas</div>
      <ul class="list-none p-0 m-0">
        <li *ngFor="let materia of lowMaterias" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
              {{ materia.nombre }}
              <span *ngIf="materia.esRepetida" class="text-xs text-red-500 ml-2">(Repetida)</span>
            </span>
            <div class="mt-1 text-muted-color">Clave: {{ materia.clave }}</div>
          </div>
          <div class="mt-2 md:mt-0 flex items-center w-full md:w-auto">
            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-full md:w-40 lg:w-24" style="height: 8px">
              <div class="bg-red-500 h-full" [ngStyle]="{ width: materia.calificacion + '%' }"></div>
            </div>
            <span class="text-red-500 ml-4 font-medium">{{ materia.calificacion }}</span>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class MateriasBajas implements OnInit {
  lowMaterias: any[] = [];

  constructor(private auth: Auth, private firestore: Firestore) {}

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) return;

      const materiasSnap = await getDocs(collection(this.firestore, `Alumnos/${user.uid}/Materias`));
      const materias = materiasSnap.docs
        .map(doc => {
          const data = doc.data() as any;
          return {
            ...data,
            calificacion: Number(data.calificacion),
            clave: doc.id
          };
        })
        .filter(mat => {
  const cal = Number(mat.calificacion); // Asegurarnos que sea un número
  const estado = mat.estado;
  const esRepetida = mat.esRepetida === true;

  if (isNaN(cal)) return false; // Excluir si calificación no es un número

  // Mostrar si es repetida
  if (esRepetida) return true;

  // Si no es repetida:
  // Solo si ya cursó y calificación <= 70
  return estado === 'ya cursó' && cal <= 70;
})
        .sort((a, b) => a.calificacion - b.calificacion)
        .slice(0, 5);

      this.lowMaterias = materias;
    });
  }
}
