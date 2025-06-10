import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticComponent } from './logistic.component';

const routes: Routes = [
  {
    path: '',
    component: LogisticComponent,
    children: [
      {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
      },
      
    {
      path: 'cars', 
      loadChildren: () => import('./general-docs/general-docs.module').then(m => m.GeneralDocsModule), 
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogisticTabRoutingModule {}
