import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Login } from './app/pages/auth/login';
import { PerfilComponent } from './app/pages/perfil/perfil';

export const appRoutes: Routes = [
    { path: '', component: Login },
    {
        path: 'home',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'perfil', loadComponent: () => import('./app/pages/perfil/perfil').then(m => m.PerfilComponent) }, // Ruta de perfil movida aquí
            {  path: 'materias',  loadComponent: () => import('./app/pages/perfil/materias').then(m => m.MateriasComponent)},
            { path: 'eval', loadComponent: () => import('./app/pages/evaluacion/evaluacion').then(m => m.EvaluacionDocenteComponent) },
            {  path: 'kardex',  loadComponent: () => import('./app/pages/kardex/kardex').then(m => m.VerMateriasComponent)},
            { path: 'mat', loadComponent: () => import('./app/pages/matdisponibles/matdisponibles').then(m => m.MateriasDisponiblesComponent) },
            { path: 'act', loadComponent: () => import('./app/pages/actcomplementarias/actcomplementarias').then(m => m.ActividadesCulturalesComponent) },
            { path: 'serv', loadComponent: () => import('./app/pages/servsocial/servsocial').then(m => m.ServicioSocialComponent) },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
