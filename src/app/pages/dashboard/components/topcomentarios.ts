import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-profesor-comentario-widget',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="font-semibold text-xl mb-6">{{ profesor.nombre }}</div>
      <div class="text-sm text-gray-600">
        <p><strong>Comentario:</strong> {{ profesor.comentario }}</p>
      </div>
    </div>
  `
})
export class TopProfesorComentarioWidget {
  @Input() profesor: { nombre: string; promedio: number; comentario: string } = {
    nombre: 'Profesor desconocido',
    promedio: 0,
    comentario: 'Sin comentario'
  };
}
