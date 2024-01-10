import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { SelectorMultipleComponent } from './selector-multiple/selector-multiple.component';
import { MostrarErroresComponent } from './mostrar-errores/mostrar-errores.component';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { ListadoGenericoComponent } from './listado-generico/listado-generico.component';
import { AgePipe } from 'src/app/services/utilidades/pipes/fechas-años.pipe';


@NgModule({
  declarations: [SelectorMultipleComponent, MostrarErroresComponent, ListadoGenericoComponent, AgePipe],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),

    // Core.
    ListModule,
    BreadcrumbsModule
  ],
  exports: [SelectorMultipleComponent, MostrarErroresComponent, ListadoGenericoComponent, AgePipe],
})
export class UtilidadesModule { }
