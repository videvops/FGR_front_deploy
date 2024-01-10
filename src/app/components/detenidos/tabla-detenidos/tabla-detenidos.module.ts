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

import { DetenidosModule } from '../detenidos.module';

import { TablaDetenidosComponent } from '../tabla-detenidos/tabla-detenidos.component';
import { ModalNuevoDetenidoComponent } from '../modal-nuevo-detenido/modal-nuevo-detenido.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import { BuscadorDetenidosComponent } from '../buscador-detenidos/buscador-detenidos.component';
import { BuscadorDetenidosRoutingModule } from '../buscador-detenidos/buscador-detenidos.routing.module';
import { TablaDetenidosDetenidosRoutingModule } from './tabla-detenidos.routing.module';


@NgModule({
    declarations: [
      BuscadorDetenidosComponent,
      TablaDetenidosComponent,
      ModalNuevoDetenidoComponent,
        ],
     imports: [
       CommonModule,
    //    BuscadorDetenidosRoutingModule,
    TablaDetenidosDetenidosRoutingModule,
       MaterialModule,
       ReactiveFormsModule,
       FormsModule,
       QuillModule.forRoot(),
       ScrollbarModule,       
       ScrollingModule,
       FurySharedModule,
       SweetAlert2Module.forRoot(),
       UtilidadesModule,
       DetenidosModule,
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

   export class TablaDetenidosModule { }