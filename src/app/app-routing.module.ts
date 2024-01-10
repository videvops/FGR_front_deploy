import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorizadoGuard } from './guards/seguridad/autorizado.guard';
import { LayoutComponent } from './layout/layout.component';
import { Roles } from './models/seguridad/roles/roles.enum';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/sistema/authentication/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AutorizadoGuard],
    children: [
    
      {
        path: 'usuarios',
        canActivate: [AutorizadoGuard],
        data: { roles: [Roles.Administrador,Roles.PFM_Administrador]},
        loadChildren: () =>
          import('./components/sistema/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
          ),
      },

      {
        path: 'roles',
        canActivate: [AutorizadoGuard],
        data: { roles: [Roles.Administrador,Roles.PFM_Administrador]},
        loadChildren: () =>
          import('./components/sistema/roles/roles.module').then(
            (m) => m.RolesModule
          ),
      },
      {
        path: 'detenidos',
        canActivate: [AutorizadoGuard],
        data: { roles: [Roles.Administrador,Roles.PFM_Administrador, Roles.PFM_Capturista, Roles.PFM_Consulta]},
        loadChildren: () =>
          import('./components/detenidos/tabla-detenidos/tabla-detenidos.module').then(
            (m) => m.TablaDetenidosModule
          ),
        
      },
      {
        path: 'detencionesOnLine',
        canActivate: [AutorizadoGuard],
        data: { roles: [Roles.Administrador,Roles.CENAPI_Administrador]},
        loadChildren: () =>
          import('./components/detenidos-on-line/tabla-detenidos-online/tabla-detenidos-online.module').then(
            (m) => m.TablaDetenidosOnLineModule
          ),
        
      }


   
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
