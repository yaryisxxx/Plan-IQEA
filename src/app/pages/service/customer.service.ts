import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Materias } from '../../modelo/materias';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable()
export class MateriasService {
    
    selectedMateria :Materias = new Materias();
    materiasList!: AngularFireList<any>;

    constructor(private firebase: AngularFireDatabase) {}

    getMateria() {
        return this.materiasList = this.firebase.list('Materias');
    }

    insertPersona(materias: Materias) {

        this.materiasList.push({
            ClaveMateria:materias.ClaveMateria,
            Lunes:materias.Lunes,
            Martes:materias.Martes,
            Miercoles:materias.Miercoles,
            Jueves:materias.Jueves,
            Viernes:materias.Viernes,
            Maestro:materias.Maestro
        });
      }
}
