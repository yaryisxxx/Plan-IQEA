import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { environment } from './app/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { appConfig } from './app.config';
 

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()), 
    provideFirebaseApp(() => initializeApp({ projectId: "plan-iqea", appId: "1:500713463197:web:c0d96cd916e3b001c6e374", databaseURL: "https://plan-iqea-default-rtdb.firebaseio.com", storageBucket: "plan-iqea.firebasestorage.app", apiKey: "AIzaSyAO8ExDPW-u2vt33aRLVX77OP-M_5f2hdA", authDomain: "plan-iqea.firebaseapp.com", messagingSenderId: "500713463197" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()) // Agregar soporte para Realtime Database
  ],
}).catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));