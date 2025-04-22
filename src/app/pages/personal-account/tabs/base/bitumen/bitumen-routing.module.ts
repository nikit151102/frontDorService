import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitumenComponent } from './bitumen.component';

const routes: Routes = [
  {
    path: '',
    component: BitumenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitumenTabRoutingModule {}
