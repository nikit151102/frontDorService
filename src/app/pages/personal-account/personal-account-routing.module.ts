import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountComponent } from './personal-account.component';

const routes: Routes = [
  {
    path: '', component: PersonalAccountComponent,
    children: [
      {
        path: '',
        redirectTo: '', 
        pathMatch: 'full'  
      },      
    {
      path: ':configType', 
      loadChildren: () => import('./components/reference-book/reference-book.module').then(m => m.ReferenceBookModule) 
    },
    //   {
    //     path: 'counterparties', 
    // loadChildren: () => import('./thanks/thanks.module').then(m => m.ThanksModule)
    //   },
    //   {
    //     path: 'home', 
    //     loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
    //   },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
