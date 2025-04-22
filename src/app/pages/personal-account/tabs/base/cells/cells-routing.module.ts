import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CellsComponent } from './cells.component';

const routes: Routes = [
  {
    path: '',
    component: CellsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CellsTabRoutingModule {}
