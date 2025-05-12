import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule, CheckboxModule, InputTextModule, PasswordModule,
        FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,
        CommonModule, ToastModule
    ],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgb(23, 130, 236)15%, rgba(23, 129, 236, 0.16) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8" flex justify-center items-center>
                            <img src="assets/img/Logo 2.png" width="120" class="mx-auto">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a Plan IQEA</div>
                            <span class="text-muted-color font-medium">Ingresa para continuar</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <a class="text-blue-600 underline font-medium ml-auto cursor-pointer" routerLink="/auth/access">Registrarse</a>
                            </div>
                            <p-button label="Ingresar" styleClass="p-button-azul w-full" (click)="login()"></p-button>
                            <p-toast></p-toast>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';
    password: string = '';

    constructor(
        private auth: Auth,
        private firestore: Firestore,
        private router: Router,
        private messageService: MessageService
    ) {}

    async login() {
        try {
            // 1. Autenticación con Firebase
            const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
            const uid = userCredential.user.uid;

            // 2. Verificación en Firestore
            const docRef = doc(this.firestore, 'Alumnos', uid);
            const userDoc = await getDoc(docRef);

            if (!userDoc.exists()) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'No inscrito',
                    detail: 'Este usuario no está inscrito en el plan.'
                });
                return;
            }

            // 3. Todo bien, redirige
            this.router.navigate(['/home']);
        } catch (error: any) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de ingreso',
                detail: 'Usuario o contraseña incorrectos'
            });
            console.error(error);
        }
    }
}
