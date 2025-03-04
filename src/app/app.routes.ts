import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: ':id', loadChildren: () => import('./pages/personal-account/supplier/supplier.module').then(m => m.SupplierModule)
    },

];
