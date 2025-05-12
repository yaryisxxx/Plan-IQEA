import { Component, OnInit, inject, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

import materiasIscJson from '../../../assets/data/materias_isc.json';
import materiasIelJson from '../../../assets/data/materias_iel.json';
import materiasIqJson from '../../../assets/data/materias_iq.json';
import materiasIamJson from '../../../assets/data/materias_iam.json';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule, TableModule, FormsModule, SelectModule, CardModule,
    ButtonModule, DropdownModule, InputTextModule, CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 min-h-screen bg-surface-50 dark:bg-surface-950">
      <h2 class="text-2xl font-bold mb-6 text-center">Materias del Usuario</h2>

      <p-select
        [options]="estados"
        [(ngModel)]="estadoSeleccionado"
        placeholder="Filtrar por estado"
        class="mb-4 w-full md:w-1/4"
        (onChange)="filtrarMaterias()"
      ></p-select>

      <p-table [value]="materias" class="w-full shadow-2 surface-card border-round">
        <ng-template pTemplate="header">
          <tr>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Créditos</th>
            <th>Estado</th>
            <th>Repetida</th>
            <th>Calificación</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-materia>
          <tr>
            <td>{{ materia.clave }}</td>
            <td>{{ materia.nombre }}</td>
            <td>{{ materia.creditos }}</td>
            <td>{{ materia.estado }}</td>
            <td>{{ materia.esRepetida ? 'Sí' : 'No' }}</td>
            <td>{{ materia.calificacion }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class VerMateriasComponent implements OnInit {
  materias: any[] = [];
  todasMaterias: any[] = [];
  estadoSeleccionado: string = '';
  estados = [
    { label: 'Todas', value: '' },
    { label: 'Ya cursó', value: 'Ya cursó' },
    { label: 'Está cursando', value: 'Está cursando' },
    { label: 'No cursada', value: 'No cursada' }
  ];

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  private materiasJsonMap: { [key: string]: any[] } = {
    'Ingeniería en Sistemas Computacionales': this.convertirJsonEnArray(materiasIscJson),
    'Ingeniería en Electrónica': this.convertirJsonEnArray(materiasIelJson),
    'Ingeniería Química': this.convertirJsonEnArray(materiasIqJson),
    'Ingeniería Ambiental': this.convertirJsonEnArray(materiasIamJson)
  };

  ngOnInit() {
  runInInjectionContext(this.injector, async () => {
    // Inyección de Firebase dentro del contexto
    const firestore = inject(Firestore);
    const auth = inject(Auth);

    const user = auth.currentUser;
    

    if (!user) {
      console.warn('No hay usuario autenticado.');
      return;
    }

    // Obtener el documento del alumno
    const alumnoRef = doc(firestore, 'Alumnos', user.uid);
    console.log('UID del usuario autenticado:', user.uid);
    const alumnoSnap = await getDoc(alumnoRef);

    if (!alumnoSnap.exists()) {
      console.warn('No se encontró el documento del alumno.');
      return;
    }

    // Obtener la carrera
    const carreraRaw = alumnoSnap.data()?.['carrera'];
    const carreraLabel = carreraRaw?.label;

    if (!carreraLabel || !this.materiasJsonMap[carreraLabel]) {
      console.warn('El usuario no tiene una carrera válida');
      return;
    }

    const materiasJSON = this.materiasJsonMap[carreraLabel];

    // Obtener las materias del usuario
    const materiasRef = collection(firestore, 'Alumnos', user.uid, 'Materias');
    const snapshot = await getDocs(materiasRef);

    const materiasUsuario: { [clave: string]: any } = {};

snapshot.forEach(docSnap => {
  console.log(`Materia de Firestore - ID: ${docSnap.id}`, docSnap.data());
  materiasUsuario[docSnap.id.toUpperCase()] = docSnap.data();  // Normalizar clave
});

this.materias = materiasJSON.map(materia => {
  const dataUsuario = materiasUsuario[materia.clave.toUpperCase()];
  console.log(`Comprobando materia - Clave: ${materia.clave}`, dataUsuario);

  return {
    clave: materia.clave,
    nombre: materia.nombre,
    creditos: materia.creditos,
    estado: dataUsuario?.estado || 'No cursada',
    esRepetida: dataUsuario?.esRepetida || false,
    calificacion: dataUsuario?.calificacion || ''
  };
});

const docTest = await getDoc(doc(firestore, 'Alumnos', user.uid, 'materias', 'ACA0909'));
console.log('Prueba lectura directa:', docTest.exists(), docTest.data());
    this.todasMaterias = [...this.materias];

    if (this.materias.length > 0) {
      console.log('✅ Materias cargadas correctamente');
    } else {
      console.warn('⚠️ No se encontraron materias para mostrar');
    }
  });
}

  filtrarMaterias() {
    this.materias = this.estadoSeleccionado
      ? this.todasMaterias.filter(m => m.estado === this.estadoSeleccionado)
      : [...this.todasMaterias];
  }

  convertirJsonEnArray(json: { [clave: string]: { nombre: string, creditos: number } }): any[] {
    return Object.keys(json).map(key => ({
      clave: key,
      nombre: json[key].nombre,
      creditos: json[key].creditos
    }));
  }
}
