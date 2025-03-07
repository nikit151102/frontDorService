import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterpartiesComponent } from './counterparties.component';

const routes: Routes = [
  {
    path: '', component: CounterpartiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsVerificationPagesRoutingModule { }
