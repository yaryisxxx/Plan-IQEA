import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materias } from '../modelo/materias';

import { AngularFireDatabase,AngularFireList } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class MateriasService {
    materiasList!: AngularFireList<Materias>;
    constructor(private db: AngularFireDatabase) {
      this.materiasList = db.list<Materias>('materias');
    }

    getMateria():Observable<Materias[]> {
        return this.materiasList.valueChanges() as Observable<Materias[]>; // Devuelve un Observable      
    }

    insertMateria(materias: Materias) {

       
            this.materiasList.push(materias);
      }
}
