import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-top-grades-widget',
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="font-semibold text-xl mb-6">Mejores Calificaciones</div>
      <ul class="list-none p-0 m-0">
        <li *ngFor="let materia of topMaterias" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ materia.nombre }}</span>
            <div class="mt-1 text-muted-color">Clave: {{ materia.clave }}</div>
          </div>
          <div class="mt-2 md:mt-0 flex items-center w-full md:w-auto">
            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-full md:w-40 lg:w-24" style="height: 8px">
              <div class="bg-blue-500 h-full" [ngStyle]="{ width: materia.calificacion + '%' }"></div>
            </div>
            <span class="text-blue-500 ml-4 font-medium">{{ materia.calificacion }}</span>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class MateriaAlumno implements OnInit {
  topMaterias: any[] = [];

  constructor(private auth: Auth, private firestore: Firestore) {}

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) return;

      const materiasSnap = await getDocs(collection(this.firestore, `Alumnos/${user.uid}/Materias`));
      const materias = materiasSnap.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            calificacion: Number(data['calificacion']), // asegura que sea número
            clave: doc.id                            // usa el ID como clave
          };
        })
        .filter(mat => !isNaN(mat.calificacion))     // descarta calificaciones inválidas
        .sort((a, b) => b.calificacion - a.calificacion)
        .slice(0, 5);

      this.topMaterias = materias;
    });
  }
}
