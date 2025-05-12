import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { PerfilComponent } from './perfil/perfil';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'perfil', loadComponent: () => import('./perfil/perfil').then(m => m.PerfilComponent) },
    { path: 'kardex', loadComponent: () => import('./kardex/kardex').then(m => m.VerMateriasComponent) },
    { path: 'eval', loadComponent: () => import('./evaluacion/evaluacion').then(m => m.EvaluacionDocenteComponent) },
    { path: 'mat', loadComponent: () => import('./matdisponibles/matdisponibles').then(m => m.MateriasDisponiblesComponent) },
    { path: 'act', loadComponent: () => import('./actcomplementarias/actcomplementarias').then(m => m.ActividadesCulturalesComponent) },
    { path: 'serv', loadComponent: () => import('./servsocial/servsocial').then(m => m.ServicioSocialComponent) },
    { path: '**', redirectTo: '/notfound' } // ESTA DEBE IR AL FINAL
] as Routes;
