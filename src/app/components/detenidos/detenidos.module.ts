import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from '../../../@fury/shared/material-components.module';
import { ScrollbarModule } from '../../../@fury/shared/scrollbar/scrollbar.module';


import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { UtilidadesModule } from '../common/utilidades.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from 'src/@fury/shared/card/card.module';
import { HighlightModule } from 'src/@fury/shared/highlightjs/highlight.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { DetenidosRoutingModule } from './detenidos-routing.module';
import { ModalEditarDetenidosComponent } from './modal-editar-detenidos/modal-editar-detenidos.component';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ScrollbarModule,
    ScrollingModule,
    FurySharedModule,
    SweetAlert2Module.forRoot(),
    UtilidadesModule,
    DetenidosRoutingModule,
 

    // Core
    ListModule,
    HighlightModule,
    FuryCardModule,
    BreadcrumbsModule,
  ],
  declarations: [

  ModalEditarDetenidosComponent],

  // providers: [ProcesoPenalService] //cambiar a los servicios de detenidos
})
export class DetenidosModule {
}
