import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectorComponent } from './director.component';

const routes: Routes = [
  {
    path: '',
    component: DirectorComponent,
    children: [
      {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
      },
      
    {
      path: 'cars', 
      loadChildren: () => import('./tabs/cars/cars.module').then(m => m.CarsModule), 
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectorTabRoutingModule {}
