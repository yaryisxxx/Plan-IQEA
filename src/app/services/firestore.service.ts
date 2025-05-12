import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase,AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  constructor(private firestore: AngularFirestore) {}
  agregarAlumno(usuario: string, contraseña: string) {
    // Usamos el 'usuario' como ID del documento
    return this.firestore.collection('Alumnos').doc(usuario).set({
      Usuario: usuario,
      Contraseña: contraseña
    });
  }
}
