import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MechanicCounterpartiesComponent } from './counterparties.component';

const routes: Routes = [
  {
    path: '', component: MechanicCounterpartiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MechanicCounterpartiesPagesRoutingModule { }
