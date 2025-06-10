import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralDocsComponent } from './general-docs.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralDocsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralDocsRoutingModule {}
