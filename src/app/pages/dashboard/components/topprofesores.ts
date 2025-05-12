import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { NgxStarsModule } from 'ngx-stars';
@Component({
  selector: 'app-top-profesores-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, NgxStarsModule],
  template: `
    <div class="card">
  <div class="font-semibold text-xl mb-6">Profesores Destacados</div>
  <ul class="list-none p-0 m-0">
    <li *ngFor="let profe of mejoresProfesores" class="flex items-center justify-between mb-4">
          <!-- Icono antes del nombre del profesor -->
          <i class="pi pi-user w-10 h-10-full"></i>
          <span class="font-medium">{{ profe.nombre }}</span>
      <div class="flex items-center gap-2">
        <div class="stars-wrapper">
  <div class="stars-bg">★★★★★</div>
  <div class="stars-fg" [style.width.%]="(profe.promedio / 5) * 100">★★★★★</div>
</div>
        <span class="text-sm text-gray-600">({{ profe.promedio }})</span>
      </div>
    </li>
  </ul>
</div>
  `
})
export class TopProfesoresWidget implements OnInit {
  mejoresProfesores: { nombre: string; promedio: number }[] = [];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const colSnap = await getDocs(collection(this.firestore, 'Evaluaciones'));

    const profesores = colSnap.docs.map(doc => {
      const data = doc.data();
      
      // Muestra el documento completo para examinar la estructura
      console.log('Documento completo:', data);

      // Verificar si 'ProfesorId' es un objeto con 'label' y 'value'
      const profesorId = data['profesorId'];
      console.log('ProfesorId:', profesorId); // Muestra el campo ProfesorId

      const nombreProfesor = profesorId && profesorId.label ? profesorId.label : 'Profesor desconocido';

      const promedio = parseFloat(Number(data['promedio']).toFixed(1)); // Redondeamos el promedio

      console.log('Profesor:', nombreProfesor, 'Promedio:', promedio); // Imprimir para ver si conseguimos el nombre y el promedio

      return {
        nombre: nombreProfesor,
        promedio: promedio
      };
    });

    // Verificar los datos antes de mostrarlos
    console.log('Profesores obtenidos:', profesores);

    this.mejoresProfesores = profesores
  .filter(p => !isNaN(p.promedio))
  .sort((a, b) => b.promedio - a.promedio)
  .slice(0, 3);
  }
}
