import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';

import materiasIscJson from '../../../assets/data/materias_isc.json';
import materiasIelJson from '../../../assets/data/materias_iel.json';
import materiasIqJson from '../../../assets/data/materias_iq.json';
import materiasIamJson from '../../../assets/data/materias_iam.json';

interface Materia {
  clave: string;
  nombre: string;
  creditos: number;
  estado?: string;
  esRepetida?: boolean;
  calificacion?: number;
}

// ... (importaciones sin cambios)

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  template: ` 
    <p-toast></p-toast>
    <div *ngIf="materias.length === 0" class="p-4 text-center">No hay materias disponibles</div>

    <div class="p-fluid w-full card mt-6 p-4 shadow-2 surface-card border-round" *ngIf="materias.length > 0">
      <h2 class="text-xl font-semibold mb-4 text-center">Selecciona tus Materias</h2>
      <div *ngFor="let mat of materias" class="field grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
        <div class="col-span-2">
          <div><strong>{{ mat.clave }} - {{ mat.nombre }}</strong> ({{ mat.creditos }} créditos)</div>
        </div>
        <div>
          <p-dropdown 
            [(ngModel)]="mat.estado" 
            [options]="estados" 
            optionLabel="label" optionValue="value"
            placeholder="Estado"
            (onChange)="onChange(mat)"
            [disabled]="edicionDeshabilitada"
          ></p-dropdown>
        </div>
        <div class="flex items-center gap-2">
          <p-checkbox 
            [(ngModel)]="mat.esRepetida" 
            binary="true" 
            (onChange)="onChange(mat)"
            [disabled]="edicionDeshabilitada"
          ></p-checkbox>
          <label>Repetida/Especial</label>
        </div>
        <div>
          <input 
            pInputText 
            type="number" 
            [(ngModel)]="mat.calificacion" 
            [disabled]="edicionDeshabilitada || mat.esRepetida || mat.estado !== 'Ya cursó'" 
            placeholder="Calificación"
            (blur)="onChange(mat)"
          />
        </div>
      </div>

      <div class="text-center mt-4">
        <button *ngIf="!edicionDeshabilitada" pButton label="Guardar Todo" class="p-button-success mr-2" (click)="guardarTodas()"></button>
        <button *ngIf="edicionDeshabilitada" pButton label="Editar materias" class="p-button-warning" (click)="habilitarEdicion()"></button>
      </div>
    </div>
  `
})
export class MateriasComponent implements OnInit {
  materias: Materia[] = [];
  edicionDeshabilitada = false;

  estados = [
    { label: 'Ya cursó', value: 'Ya cursó' },
    { label: 'Está cursando', value: 'Está cursando' },
    { label: 'No cursada', value: 'No cursada' }
  ];

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const perfilRef = doc(this.firestore, 'Alumnos', user.uid);
    const perfilSnap = await getDoc(perfilRef);
    if (!perfilSnap.exists()) return;

    const carrera = perfilSnap.data()['carrera']?.label;
    console.log('Carrera del usuario:', carrera);

    const pruebaRef = doc(this.firestore, `Alumnos/${user.uid}/Materias`, 'ACA0909');
    const pruebaSnap = await getDoc(pruebaRef);

    if (pruebaSnap.exists()) {
      const materiasRef = collection(this.firestore, `Alumnos/${user.uid}/Materias`);
      const snapshot = await getDocs(materiasRef);
      this.materias = snapshot.docs.map(doc => ({
        clave: doc.id,
        ...doc.data()
      })) as Materia[];

      this.edicionDeshabilitada = true;
      console.log('Materias cargadas desde Firestore:', this.materias);
      return;
    }

    let materiasObj: any = {};
    switch (carrera) {
      case 'Ingeniería en Sistemas Computacionales':
        materiasObj = materiasIscJson;
        break;
      case 'Ingeniería en Electrónica':
  materiasObj = materiasIelJson;
  break;
      case 'Ingeniería Química':
        materiasObj = materiasIqJson;
        break;
      case 'Ingeniería Ambiental':
        materiasObj = materiasIamJson;
        break;
      default:
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Carrera no reconocida.' });
        return;
    }

    this.materias = Object.entries(materiasObj).map(([clave, mat]: [string, any]) => ({
      clave,
      nombre: mat.nombre,
      creditos: mat.creditos,
      estado: '',
      esRepetida: false,
      calificacion: 0
    }));

    console.log('Materias nuevas desde JSON:', this.materias);
  }

  onChange(mat: Materia) {
    if (mat.estado === 'Ya cursó') {
      if (!mat.calificacion || mat.calificacion < 70) {
        mat.calificacion = 70;
      }

      if (
        isNaN(mat.calificacion) ||
        mat.calificacion < 70 ||
        mat.calificacion > 100
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Calificación inválida',
          detail: 'Debe ser un número entre 70 y 100'
        });
        mat.calificacion = 70;
      }
    }

    console.log('Materia cambiada:', mat);
  }

  async guardarTodas() {
    const user = this.auth.currentUser;
    if (!user) return;

    for (const mat of this.materias) {
      if (!mat.estado) continue;

      const materiaRef = doc(this.firestore, `Alumnos/${user.uid}/Materias`, mat.clave);
      await setDoc(materiaRef, {
        nombre: mat.nombre,
        creditos: mat.creditos,
        estado: mat.estado,
        esRepetida: mat.esRepetida || false,
        calificacion: mat.estado === 'Ya cursó' ? mat.calificacion : null
      });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Guardado exitoso',
      detail: 'Las materias se guardaron correctamente.'
    });

    this.edicionDeshabilitada = true;
  }

  habilitarEdicion() {
    this.edicionDeshabilitada = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Modo edición activado',
      detail: 'Puedes modificar tus materias nuevamente.'
    });
  }
}
