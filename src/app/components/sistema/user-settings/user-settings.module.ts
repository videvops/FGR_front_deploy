import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../@fury/shared/material-components.module';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings.component';
import { FurySharedModule } from '../../../../@fury/fury-shared.module';
import { HighlightModule } from 'src/@fury/shared/highlightjs/highlight.module';
import { FuryCardModule } from 'src/@fury/shared/card/card.module';
import { BreadcrumbsModule } from 'src/@fury/shared/breadcrumbs/breadcrumbs.module';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { UtilidadesModule } from '../../common/utilidades.module';

@NgModule({
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    MaterialModule,
    FurySharedModule,
    ReactiveFormsModule,
    UtilidadesModule,

    // Core
    HighlightModule,
    FuryCardModule,
    BreadcrumbsModule
  ],
  declarations: [
    UserSettingsComponent,
    UserAvatarComponent
  ],
})
export class UserSettingsModule {
}
