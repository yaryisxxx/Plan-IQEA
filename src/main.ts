import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { environment } from './app/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()) // Agregar soporte para Realtime Database
  ]
}).catch(err => console.error(err));

