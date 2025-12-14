import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
    children: [
      {
        path: '',
        redirectTo: '349246',
        pathMatch: 'full'
      },
      {
        path: '349246',
        loadComponent: () => import('./driver-salary/driver-salary.component').then(m => m.DriverSalaryComponent),
      },
      {
        path: '349143',
        loadComponent: () => import('./driver-salary/driver-salary.component').then(m => m.DriverSalaryComponent),
      },
      {
        path: '341652',
        loadComponent: () => import('./driver-salary/driver-salary.component').then(m => m.DriverSalaryComponent),
      },
      {
        path: '305641',
        loadComponent: () => import('./driver-salary/driver-salary.component').then(m => m.DriverSalaryComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalTabRoutingModule { }
