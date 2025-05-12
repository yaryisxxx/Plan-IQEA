import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-actividades-culturales',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    FormsModule,ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Actividades Culturales en la Universidad</div>

      <p-table
        #dt
        [value]="actividades"
        [scrollable]="true"
        [style]="{ 'width': '100%' }"
        scrollWidth="1200px"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="min-width:200px" class="font-bold">Actividad</th>
            <th style="min-width:200px">Fecha</th>
            <th style="min-width:200px">Duración</th>
            <th style="min-width:200px">Tipo de Actividad</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-actividad>
          <tr>
            <td>{{ actividad?.nombre }}</td>
            <td>{{ actividad?.fecha }}</td>
            <td>{{ actividad?.duracion }}</td>
            <td>{{ actividad?.tipo }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .p-datatable-frozen-tbody {
      font-weight: bold;
    }

    .p-datatable-scrollable .p-frozen-column {
      font-weight: bold;
    }
  `]
})
export class ActividadesCulturalesComponent implements OnInit {
  actividades: any[] = [];
  
  // Días de la semana y rangos horarios
  diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horarios = ['10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
  setTimeout(() => {
    this.messageService.add({
      severity: 'info',
      summary: 'Cargando actividades...',
      detail: 'La carga de actividades está siendo recibida, pronto se abrirán más grupos.',
      life: 5000
    });
  }, 100); // 100ms para asegurar que la vista esté lista

  this.actividades = [
    this.crearActividad('Teatro Universitario'),
    this.crearActividad('Concierto de Música Clásica'),
    this.crearActividad('Exposición de Arte'),
    this.crearActividad('Cine Debate'),
    this.crearActividad('Taller de Danza Folklórica')
  ];
}

  crearActividad(nombre: string) {
    // Selección aleatoria de día y horario
    const diaAleatorio = this.diasDeLaSemana[Math.floor(Math.random() * this.diasDeLaSemana.length)];
    const horarioAleatorio = this.horarios[Math.floor(Math.random() * this.horarios.length)];

    return {
      nombre: nombre,
      fecha: diaAleatorio,
      duracion: horarioAleatorio,
      tipo: 'Cultural'
    };
  }
}
