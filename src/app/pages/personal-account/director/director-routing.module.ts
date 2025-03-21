import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectorComponent } from './director.component';

const routes: Routes = [
  {
    path: '', component: DirectorComponent,
    children: [
      { path: '', redirectTo: 'documents', pathMatch: 'full' }, 
      // { path: 'home', component: SupplierHomeComponent },
      {
        path: 'reference', loadChildren: () => import('./tabs/reference/reference.module').then(m => m.ReferenceModule)
      },
      {
        path: 'services', loadChildren: () => import('./tabs/services/counterparties.module').then(m => m.CounterpartieSservicesModule)
      },
      // {
      //   path: 'profile', loadChildren: () => import('../../../components/profile/profile.module').then(m => m.ProfileModule)
      // },
      {
        path: 'documents', loadChildren: () => import('./tabs/counterparties/counterparties.module').then(m => m.CounterpartiesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectorPagesRoutingModule { }
