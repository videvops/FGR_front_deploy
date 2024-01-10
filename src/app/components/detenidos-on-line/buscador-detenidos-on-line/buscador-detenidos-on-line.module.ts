import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ScrollbarModule } from 'src/@fury/shared/scrollbar/scrollbar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UtilidadesModule } from 'src/app/components/common/utilidades.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { HighlightModule } from 'src/@fury/shared/highlightjs/highlight.module';
import { FuryCardModule } from 'src/@fury/shared/card/card.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';

import { BuscadorDetenidosOnLineRoutingModule } from './buscador-detenidos-on-line.routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';

import { DetenidosOnLineModule } from '../detenidos-on-line.module';
import { ModalAsignacionDetenidosComponent } from '../modal-asignacion-detenidos/modal-asignacion-detenidos.component';
import { ModalDatosDetenidosComponent } from '../modal-datos-detenidos/modal-datos-detenidos.component';
import { ArchivoDetenidoCenapiComponent } from '../archivo-detenido-cenapi/archivo-detenido-cenapi.component';
import { ModalFichasComponent } from '../modal-fichas/modal-fichas.component';


@NgModule({
    declarations: [
      ModalAsignacionDetenidosComponent,
      ModalDatosDetenidosComponent,
       ArchivoDetenidoCenapiComponent,
       ModalFichasComponent

        ],
     imports: [
       CommonModule,
       BuscadorDetenidosOnLineRoutingModule,
       MaterialModule,
       ReactiveFormsModule,
       FormsModule,
       QuillModule.forRoot(),
       ScrollbarModule,       
       ScrollingModule,
       FurySharedModule,
       SweetAlert2Module.forRoot(),
       UtilidadesModule,
       DetenidosOnLineModule,
       MatFormFieldModule,
       MatExpansionModule,
     
       
       // Core
       ListModule,
       HighlightModule,
       FuryCardModule,
       BreadcrumbsModule,
   
     ],
   
     exports: [
      
     ]
   })

   export class BuscarDetenidosOnLineModule { }