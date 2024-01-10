import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BuscadorDetenidosOnLineComponent } from './buscador-detenidos-on-line.component';


const routes: Routes = [
  { path: '', component: BuscadorDetenidosOnLineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuscadorDetenidosOnLineRoutingModule { }
