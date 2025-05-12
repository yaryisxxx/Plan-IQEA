import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-materias-disponibles',
  standalone: true,
  imports: [
    TableModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Materias Disponibles</div>

      <p-togglebutton
        [(ngModel)]="Frozen"
        [onIcon]="'pi pi-lock'"
        [offIcon]="'pi pi-lock-open'"
        [onLabel]="'Maestro congelado'"
        [offLabel]="'Maestro libre'"
      ></p-togglebutton>

      <p-table
        #dt
        [value]="materias"
        [scrollable]="true"
        [style]="{ 'width': '100%' }"
        scrollWidth="1200px"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pFrozenColumn style="min-width:200px" class="font-bold">Materia</th>
            <th style="min-width:100px">Clave Grupo</th>
            <th style="min-width:200px">Lunes</th>
            <th style="min-width:200px">Martes</th>
            <th style="min-width:200px">Miércoles</th>
            <th style="min-width:200px">Jueves</th>
            <th style="min-width:200px">Viernes</th>
            <th
              pFrozenColumn
              [frozen]="Frozen"
              alignFrozen="right"
              style="min-width:200px"
              [ngClass]="{ 'font-bold': Frozen }"
            >Maestro</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-materia>
          <tr>
            <td pFrozenColumn>{{ materia?.ClaveMateria }}</td>
            <td>{{ materia?.ClaveGrupo }}</td>
            <td>{{ materia?.Lunes }}</td>
            <td>{{ materia?.Martes }}</td>
            <td>{{ materia?.Miercoles }}</td>
            <td>{{ materia?.Jueves }}</td>
            <td>{{ materia?.Viernes }}</td>
            <td
              pFrozenColumn
              [frozen]="Frozen"
              alignFrozen="right"
            >{{ materia?.Maestro }}</td>
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
export class MateriasDisponiblesComponent implements OnInit, AfterViewInit {
  Frozen = false;
  materias: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Aquí no se muestra el toast aún
  }

  ngAfterViewInit(): void {
    // Mostramos el toast después de que la vista está montada
    setTimeout(() => {
      if (this.materias.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Sin materias disponibles',
          detail: 'Por el momento no hay materias disponibles. Espere a que sus coordinadores nos proporcionen esa información.',
          life: 7000
        });
      }
    });
  }
}
