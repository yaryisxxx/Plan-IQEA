import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { Auth } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        AppConfigurator,
        MenuModule
    ],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo">
                    <img src="assets/img/Logo 2.png" width="30" class="mx-auto" />
                    <span>PLAN IQUEA</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <div class="relative">
                        <app-configurator />
                    </div>
                </div>

                <button
                    class="layout-topbar-menu-button layout-topbar-action"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                >
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <p-menu #userMenu [model]="menuItems" [popup]="true"></p-menu>
                        <button type="button" class="layout-topbar-action" (click)="userMenu.toggle($event)">
                            <i class="pi pi-user"></i>
                            <span>Cuenta</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar {
    menuItems: MenuItem[] = [];

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private auth: Auth
    ) {
        this.menuItems = [
            {
                label: 'Editar usuario',
                icon: 'pi pi-cog',
                command: () => this.router.navigate(['/home/perfil'])
            },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => this.cerrarSesion()
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    async cerrarSesion() {
        await signOut(this.auth);
        this.router.navigate(['/']);
    }
}
