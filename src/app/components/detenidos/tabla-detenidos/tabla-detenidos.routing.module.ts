import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TablaDetenidosComponent } from './tabla-detenidos.component';



const routes: Routes = [
  { path: '', component: TablaDetenidosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaDetenidosDetenidosRoutingModule { }
