import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { UserCreateUpdateModule } from './user-create-update/user-create-update.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { ModalSeparoComponent } from '../separo/modal-sepraro/modal-separo/modal-separo.component';
import { ScrollbarModule } from 'src/@fury/shared/scrollbar/scrollbar.module';
import { QuillModule } from 'ngx-quill';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UtilidadesModule } from '../../common/utilidades.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    ModalSeparoComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule.forRoot(),
    ScrollbarModule,       
    ScrollingModule,
    FurySharedModule,
    SweetAlert2Module.forRoot(),
    UtilidadesModule,
    MatFormFieldModule,
    MatExpansionModule,

    // Core
    ListModule,
    UserCreateUpdateModule,
    UserRolesModule,
    BreadcrumbsModule,
    MatTreeModule,
  ],
  exports: [UsuariosComponent]
})
export class UsuariosModule { }
