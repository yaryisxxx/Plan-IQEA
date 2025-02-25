import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Escuela',
                items: [
                    { label: 'Grupos', icon: 'pi pi-fw pi-id-card', routerLink: [''] },
                    { label: 'Evaluacion', icon: 'pi pi-fw pi-id-card', routerLink: [''] }                    
                ]
            },
            {
                label: 'Personal',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Kardex',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/']
                    },
                    {
                        label: 'Horario',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/']
                    },
                   
                ]
            },
            {
                label: 'Herramientas',
                items: [
                    {
                        label: 'Creador',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/']
                    },
                    {
                        label: 'Subir',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/']
                    }
                ]
            },
        ];
    }
}
