import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceBookComponent } from './reference-book.component';

const routes: Routes = [
  {
    path: '', 
    component: ReferenceBookComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class ReferenceBookPagesRoutingModule { }
