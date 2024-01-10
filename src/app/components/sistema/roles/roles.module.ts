import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { FurySharedModule } from 'src/@fury/fury-shared.module';
import { ListModule } from 'src/@fury/shared/list/list.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { RoleCreateUpdateModule } from './role-create-update/role-create-update.module';
import { AsignaRolesProductosModule } from './asigna-roles-productos/asigna-roles-productos.module';

@NgModule({
  declarations: [
    RolesComponent,
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FormsModule,
    MaterialModule,
    FurySharedModule,

    // Core
    ListModule,
    RoleCreateUpdateModule,
    AsignaRolesProductosModule,
    BreadcrumbsModule
  ],
  exports: [RolesComponent]
})
export class RolesModule { }
