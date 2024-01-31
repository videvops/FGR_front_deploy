import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Touch functionality of Material Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PendingInterceptorModule } from '../@fury/shared/loading-indicator/pending-interceptor.module';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { SeguridadInterceptorService } from './services/seguridad/seguridad-interceptor.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Fury Core Modules
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,

    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    MatIconModule,
    SweetAlert2Module.forRoot(),
   MatAutocompleteModule,
   FormsModule,
   ReactiveFormsModule,
   MatInputModule,
   MatFormFieldModule,


   
 
  ],
  
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SeguridadInterceptorService,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      } as MatFormFieldDefaultOptions,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      } as MatSnackBarConfig,
    },
  ],
})
export class AppModule {}
