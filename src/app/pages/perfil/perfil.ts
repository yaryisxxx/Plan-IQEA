import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-surface-50 dark:bg-surface-950 flex justify-center items-center p-4">
      <div class="w-full max-w-2xl p-6 bg-white dark:bg-surface-900 rounded-lg shadow-md space-y-6">

        <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white">Editar Perfil</h2>

        <!-- Nombres -->
        <div class="flex flex-col gap-2">
          <label for="nombres" class="font-medium">Nombres</label>
          <input id="nombres" type="text" pInputText [(ngModel)]="perfil.nombres" [disabled]="edicionDeshabilitada" />
        </div>

        <!-- Apellidos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="apellidoPaterno" class="font-medium">Apellido Paterno</label>
            <input id="apellidoPaterno" type="text" pInputText [(ngModel)]="perfil.apellidoPaterno" [disabled]="edicionDeshabilitada" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="apellidoMaterno" class="font-medium">Apellido Materno</label>
            <input id="apellidoMaterno" type="text" pInputText [(ngModel)]="perfil.apellidoMaterno" [disabled]="edicionDeshabilitada" />
          </div>
        </div>

        <!-- Usuario -->
        <div class="flex flex-col gap-2">
          <label for="usuario" class="font-medium">Nombre de Usuario</label>
          <input id="usuario" type="text" pInputText [(ngModel)]="perfil.usuario" [disabled]="edicionDeshabilitada" />
          <small class="text-sm text-gray-500">Este nombre será visible para otros usuarios.</small>
        </div>

        <!-- Carrera -->
        <div class="flex flex-col gap-2">
          <label for="carrera" class="font-medium">Carrera</label>
          <p-dropdown
            id="carrera"
            [options]="carreras"
            [(ngModel)]="perfil.carrera"
            placeholder="Selecciona tu carrera"
            optionLabel="label"
            class="w-full"
            [disabled]="edicionDeshabilitada"
          ></p-dropdown>
        </div>

        <!-- Velocidad de aprendizaje -->
        <div class="flex flex-col gap-2">
          <label for="velocidadAprendizaje" class="font-medium">Velocidad de Aprendizaje</label>
          <p-dropdown
            id="velocidadAprendizaje"
            [options]="velocidadesAprendizaje"
            [(ngModel)]="perfil.velocidadAprendizaje"
            placeholder="Selecciona una opción"
            optionLabel="label"
            class="w-full"
            [disabled]="edicionDeshabilitada"
          ></p-dropdown>
        </div>

        <!-- Botón -->
        <div class="text-center pt-2">
          <button *ngIf="!edicionDeshabilitada" pButton styleClass="p-button-azul w-full" label="Guardar Perfil" (click)="guardarPerfil()"></button>
          <button *ngIf="edicionDeshabilitada" pButton styleClass="p-button-success w-full" label="Siguiente" (click)="router.navigate(['/home/materias'])"></button>
        </div>

      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  perfil = {
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    usuario: '',
    carrera: '',
    velocidadAprendizaje: ''
  };

  edicionDeshabilitada = false;

  carreras = [
    { label: 'Ingeniería en Sistemas Computacionales', value: 'sistemas' },
    { label: 'Ingeniería en Electrónica', value: 'electronica' },
    { label: 'Ingeniería Ambiental', value: 'ambiental' },
    { label: 'Ingeniería Química', value: 'quimica' }
  ];

  velocidadesAprendizaje = [
    { label: 'Rápida', value: 'rápida' },
    { label: 'Moderada', value: 'moderada' },
    { label: 'Lenta', value: 'lenta' }
  ];

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    public router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  async guardarPerfil() {
    if (!this.perfil.nombres || !this.perfil.apellidoPaterno || !this.perfil.usuario || !this.perfil.carrera) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor completa todos los campos obligatorios.' });
      return;
    }

    const user = this.auth.currentUser;
    if (user) {
      try {
        const userRef = doc(this.firestore, 'Alumnos', user.uid);
        await setDoc(userRef, this.perfil, { merge: true });

        this.messageService.add({ severity: 'success', summary: 'Perfil guardado', detail: 'Tu perfil fue actualizado correctamente' });
        this.edicionDeshabilitada = true;

        setTimeout(() => {
          this.router.navigate(['/home/materias']);
        }, 1500);
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el perfil' });
      }
    }
  }

  async cargarPerfil() {
    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.firestore, 'Alumnos', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        this.perfil = docSnap.data() as any;

        // Bloqueamos edición si ya hay datos en los campos principales
        if (this.perfil.nombres && this.perfil.apellidoPaterno && this.perfil.usuario && this.perfil.carrera) {
          this.edicionDeshabilitada = true;
        }
      }
    }
  }

  // Opción para editar de nuevo si lo deseas más adelante
  habilitarEdicion() {
    this.edicionDeshabilitada = false;
  }
}
