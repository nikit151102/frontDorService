import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'bitumen',
        pathMatch: 'full'
      },
      
    {
      path: 'bitumen', 
      loadChildren: () => import('./bitumen/bitumen.module').then(m => m.BitumenModule), 
    },
    {
      path: 'cells', 
      loadChildren: () => import('./cells/cells.module').then(m => m.CellsModule), 
    },
    {
      path: 'reference/:configId', loadChildren: () => import('./reference-book/reference-book.module').then(m => m.ReferenceBookModule)
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseTabRoutingModule {}
