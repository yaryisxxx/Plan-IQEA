import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,CommonModule, ToastModule],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgb(23, 130, 236)15%, rgba(23, 129, 236, 0.16) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8" flex justify-center items-center>
                            
                        <img src="assets/img/Logo 2.png"  width="110"  class="mx-auto">
    
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Inscripción a Plan IQEA</div>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <label for="confimrPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmar contraseña</label>
                            <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <a class="text-blue-600 underline font-medium ml-auto cursor-pointer" routerLink="/">Regresar</a> <br>
                            </div>
                            <p-button label="Registrar"  styleClass="p-button-azul w-full" (click)="registrarUsuario()"></p-button>
                            <p-toast></p-toast>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class Access {
    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    constructor(
        private messageService: MessageService,
        private router: Router,
        private firestore: Firestore,
        private auth: Auth
    ) {}

    async registrarUsuario() {
        if (!this.email || !this.password || !this.confirmPassword) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos vacíos',
                detail: 'Por favor llena todos los campos.'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Email inválido',
                detail: 'Ingresa un correo electrónico válido.'
            });
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Las contraseñas no coinciden.'
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
            const uid = userCredential.user.uid;

            await setDoc(doc(this.firestore, 'Alumnos', uid), {
                Usuario: this.email,
                FechaRegistro: new Date().toISOString()
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario registrado correctamente.'
            });

            this.email = '';
            this.password = '';
            this.confirmPassword = '';

            this.router.navigate(['/home']);
        } catch (error: any) {
            let mensaje = 'Error al registrar usuario.';
            if (error.code === 'auth/email-already-in-use') {
                mensaje = 'Este correo ya está en uso.';
            } else if (error.code === 'auth/invalid-email') {
                mensaje = 'Correo electrónico inválido.';
            } else if (error.code === 'auth/weak-password') {
                mensaje = 'La contraseña es muy débil.';
            }

            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: mensaje
            });

            console.error(error);
        }
    }
}

