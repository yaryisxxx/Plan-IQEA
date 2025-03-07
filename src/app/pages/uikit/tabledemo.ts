import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { MateriasService } from '../../services/firestore.service';
import { Materias } from '../../modelo/materias';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface expandedRows {
    [key: string]: boolean;
}


@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule
    ],
    template: `<div class="card">
    <div class="font-semibold text-xl mb-4">Frozen Columns</div>

    <!-- Botón para alternar la columna congelada -->
    <p-togglebutton 
        [(ngModel)]="Frozen" 
        [onIcon]="'pi pi-lock'" 
        [offIcon]="'pi pi-lock-open'" 
        [onLabel]="'Balance'" 
        [offLabel]="'Balance'">
    </p-togglebutton>

    <!-- Tabla sin scroll vertical -->
    <p-table 
        #dt 
        [value]="Materias" 
        [scrollable]="true" 
        [style]="{ 'width': '100%' }"
        scrollWidth="1200px" 
    >
        <ng-template #header>
            <tr>
                <th pFrozenColumn style="min-width:200px" class="font-bold">Materia</th>
                <th style="min-width:100px">Clave Grupo</th>
                <th style="min-width:200px">Lunes</th>
                <th style="min-width:200px">Martes</th>
                <th style="min-width:200px">Miércoles</th>
                <th style="min-width:200px">Status</th>
                <th style="min-width:200px">Jueves</th>
                <th style="min-width:200px">Viernes</th>
                <th 
                    pFrozenColumn [frozen]="Frozen" alignFrozen="right" style="min-width:200px" [ngClass]="{ 'font-bold': Frozen }"> Maestro </th>
            </tr>
        </ng-template>

        <ng-template #body let-materias>
            <tr>
                <td pFrozenColumn class="font-bold">{{ materias?.ClaveMateria }}</td>
                <td >{{ materias?.ClaveGrupo}}</td>
                <td >{{ materias?.Lunes}}</td>
                <td >{{ materias?.Martes}}</td>
                <td >{{ materias?.Miercoles}}</td>
                <td >{{ materias?.Jueves}}</td>
                <td >{{ materias?.Viernes}}</td>
                <!-- Columna dinámica (congelada si balanceFrozen es true) -->
                <td pFrozenColumn [frozen]="Frozen" 
                    alignFrozen="right"
                    [ngClass]="{ 'font-bold': Frozen }"
                >
                    {{ formatCurrency(materias?.Maestro) }}
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [MateriasService]
})
export class TableDemo implements OnInit {
    Materias: Materias[]=[];
    Frozen = false; // Para controlar la columna congelada

  constructor(private MateriasService: MateriasService) {}

  ngOnInit() {
    this.MateriasService.getMateria().subscribe((materias) => {
        if (materias && materias.length > 0) {
          this.Materias = materias;
          console.log(materias[0].ClaveMateria); // Para verificar si los datos llegaron
        } else {
          console.log('No se encontraron materias');
        }
      });
  }
  formatCurrency(arg0: any) {
    // Implementa aquí el formato para la moneda si es necesario
    return arg0;
  }
}
