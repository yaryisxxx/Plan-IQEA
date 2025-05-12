import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AppComponent } from './app.component';
import { environment } from './app/environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

/*export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    //provideDatabase(() => getDatabase())
    ]
};*/


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        provideHttpClient(),
        provideAuth(() => getAuth()),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }), provideFirebaseApp(() => initializeApp({ projectId: "plan-iqea", appId: "1:500713463197:web:c0d96cd916e3b001c6e374", databaseURL: "https://plan-iqea-default-rtdb.firebaseio.com", storageBucket: "plan-iqea.firebasestorage.app", apiKey: "AIzaSyAO8ExDPW-u2vt33aRLVX77OP-M_5f2hdA", authDomain: "plan-iqea.firebaseapp.com", messagingSenderId: "500713463197" })), provideFirestore(() => getFirestore())
    ]
};
