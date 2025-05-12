import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-servicio-social',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Servicio Social</div>

      <p-table
        [value]="servicios"
        [scrollable]="true"
        [style]="{ 'width': '100%' }"
        scrollWidth="1000px"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="min-width: 300px">Nombre del Proyecto</th>
            <th style="min-width: 200px">Dependencia</th>
            <th style="min-width: 150px">Horario</th>
            <th style="min-width: 150px">Lugar</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-servicio>
          <tr>
            <td>{{ servicio?.nombre }}</td>
            <td>{{ servicio?.dependencia }}</td>
            <td>{{ servicio?.horario }}</td>
            <td>{{ servicio?.lugar }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .card {
      padding: 1rem;
    }
  `]
})
export class ServicioSocialComponent implements OnInit {
  servicios: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    setTimeout(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin cupos disponibles',
        detail: 'Se están recibiendo solicitudes de las dependencias. Pronto habrá cupos disponibles.',
        life: 6000
      });
    }, 100);
  }
}
