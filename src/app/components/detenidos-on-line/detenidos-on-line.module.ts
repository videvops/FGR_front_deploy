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
import { DetenidosOnLineRoutingModule } from './detenidos-on-line-routing.module';
import { ModalAsignacionDetenidosComponent } from './modal-asignacion-detenidos/modal-asignacion-detenidos.component';
import { ModalDatosDetenidosComponent } from './modal-datos-detenidos/modal-datos-detenidos.component';
import { ArchivoDetenidoCenapiComponent } from './archivo-detenido-cenapi/archivo-detenido-cenapi.component';
import { ModalFichasComponent } from './modal-fichas/modal-fichas.component';




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
    DetenidosOnLineRoutingModule,
 

    // Core
    ListModule,
    HighlightModule,
    FuryCardModule,
    BreadcrumbsModule,
  ],
  declarations: [

  ModalAsignacionDetenidosComponent,

  ModalDatosDetenidosComponent,

  ArchivoDetenidoCenapiComponent,

  ModalFichasComponent],


})
export class DetenidosOnLineModule {
}
