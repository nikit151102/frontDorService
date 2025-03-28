import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountComponent } from './personal-account.component';

const routes: Routes = [
  {
    path: '', component: PersonalAccountComponent,
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' }, 
      {
        path: 'clients', loadChildren: () => import('./tabs/partners/partners.module').then(m => m.PartnersModule)
      },
      {
        path: 'services', loadChildren: () => import('./tabs/services/services.module').then(m => m.ServicesModule)
      },
      {
        path: 'reference', loadChildren: () => import('./tabs/reference/reference.module').then(m => m.ReferenceModule)
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
