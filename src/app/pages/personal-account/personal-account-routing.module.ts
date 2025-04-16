import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountComponent } from './personal-account.component';
import { LoadingComponent } from './tabs/loading/loading.component';

const routes: Routes = [
  {
    path: '', component: PersonalAccountComponent,
    children: [
      { path: 'loading', component: LoadingComponent },
      {
        path: 'clients', loadChildren: () => import('./tabs/partners/partners.module').then(m => m.PartnersModule)
      },
      {
        path: 'reference', loadChildren: () => import('./tabs/reference/reference.module').then(m => m.ReferenceModule)
      },
      {
        path: 'accountant', loadChildren: () => import('./tabs/accountant/accountant.module').then(m => m.AccountantModule)
      },
      {
        path: 'cash', loadChildren: () => import('./tabs/cash/cash.module').then(m => m.CashModule)
      },
      {
        path: 'base', loadChildren: () => import('./tabs/base/base.module').then(m => m.BaseModule)
      },
      
      {
        path: 'profile', loadChildren: () => import('./tabs/profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
