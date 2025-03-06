import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MechanicComponent } from './mechanic.component';

const routes: Routes = [
  {
    path: '', component: MechanicComponent,
    children: [
      { path: '', redirectTo: 'services', pathMatch: 'full' }, 
      // { path: 'home', component: SupplierHomeComponent },
      {
        path: 'services', loadChildren: () => import('./tabs/counterparties/counterparties.module').then(m => m.MechanicCounterpartiesModule)
      },
      {
        path: 'profile', loadChildren: () => import('../../../components/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MechanicPagesRoutingModule { }
