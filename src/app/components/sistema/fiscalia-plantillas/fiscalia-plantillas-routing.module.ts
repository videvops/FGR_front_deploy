import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiscaliaPlantillasComponent } from './fiscalia-plantillas.component';

const routes: Routes = [
  {
    path: '',
    component: FiscaliaPlantillasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscaliaPlantillasRoutingModule {
}
