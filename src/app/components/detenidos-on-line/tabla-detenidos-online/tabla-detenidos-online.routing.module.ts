import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TablaDetenidosOnlineComponent } from './tabla-detenidos-online.component';




const routes: Routes = [
  { path: '', component: TablaDetenidosOnlineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaDetenidosDetenidosOnLineRoutingModule { }
