import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
];
