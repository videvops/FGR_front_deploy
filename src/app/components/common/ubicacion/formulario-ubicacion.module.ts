import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioUbicacionComponent } from './formulario-ubicacion.component';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FormularioUbicacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FurySharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormularioUbicacionComponent,
  ]
})
export class FormularioUbicacionModule { }
