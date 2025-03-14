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
      // {
      //   path: 'profile', loadChildren: () => import('../../../components/profile/profile.module').then(m => m.ProfileModule)
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
