import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetenidosComponent } from './detenidos.component';


const routes: Routes = [
  { path: '', component: DetenidosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetenidosRoutingModule { }