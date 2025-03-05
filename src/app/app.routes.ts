import { Routes } from '@angular/router';
import { SupplierAuthGuard } from './pages/personal-account/supplier/supplier-auth.guard';
import { MechanicAuthGuard } from './pages/personal-account/mechanic/mechanic-auth.guard';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'supplier/:id',
        loadChildren: () => import('./pages/personal-account/supplier/supplier.module').then(m => m.SupplierModule), canActivate: [SupplierAuthGuard]
    },
    {
        path: 'mechanic/:id',
        loadChildren: () => import('./pages/personal-account/mechanic/mechanic.module').then(m => m.MechanicModule), canActivate: [MechanicAuthGuard]
    }

];
