import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiscaliaPlantillasComponent } from './fiscalia-plantillas.component';
import { FiscaliaPlantillasRoutingModule } from './fiscalia-plantillas-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { EditPermisosPlantillasModule } from './edit-permisos-plantillas/edit-permisos-plantillas.module';

@NgModule({
  declarations: [
    FiscaliaPlantillasComponent
  ],
  imports: [
    CommonModule,
    FiscaliaPlantillasRoutingModule,
    FormsModule,
    MaterialModule,
    FurySharedModule,

    // Core
    ListModule,
    EditPermisosPlantillasModule,
    BreadcrumbsModule
  ],
  exports: [FiscaliaPlantillasComponent]
})
export class FiscaliaPlantillasModule { }
