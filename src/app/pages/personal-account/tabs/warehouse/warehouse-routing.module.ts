import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseComponent,
    children: [
      {
        path: '',
        redirectTo: '349142',
        pathMatch: 'full'
      },
      {
        path: '349142',
        loadComponent: () => import('./driver-salary/driver-salary.component').then(m => m.DriverSalaryComponent),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
