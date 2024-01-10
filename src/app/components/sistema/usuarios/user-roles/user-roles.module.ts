import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/@fury/shared/material-components.module';
import { UtilidadesModule } from 'src/app/components/common/utilidades.module';
import { UserRolesComponent } from './user-roles.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    UtilidadesModule,
    MaterialModule
  ],
  declarations: [UserRolesComponent],
  entryComponents: [UserRolesComponent],
  exports: [UserRolesComponent]
})
export class UserRolesModule {
}
