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
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] }]
            },
            {
                label: 'Académico',
                items: [
                    { label: 'Servicio social', icon: 'pi pi-fw pi-users', routerLink: ['/home/serv'] },
                    { label: 'Evaluacion', icon: 'pi pi-fw pi-comments', routerLink: ['/home/eval'] },     
                    { label: 'Materias disponibles', icon: 'pi pi-fw pi-book', routerLink: ['/home/mat'] },
                    { label: 'Actividades complementarias', icon: 'pi pi-fw pi-flag-fill', routerLink: ['/home/act'] }                    
                ]
            },
            {
                label: 'Personal',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/'],
                items: [
                    {
                        label: 'Kardex',
                        icon: 'pi pi-fw pi-map',
                        routerLink: ['/home/kardex']
                    }
                   
                ]
            },
            {
                label: 'Herramientas',
                items: [
                    {
                        label: 'Creador',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/home']
                    }
                ]
            },
        ];
    }
}
