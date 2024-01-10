import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class AutorizadoGuard implements CanActivate {

  constructor(private seguridadService: SeguridadService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.seguridadService.estaLogueado()) {
      let roles: string[] = this.seguridadService.getRoles();
      if (route.data.roles && !roles.some((r: string) => route.data.roles.includes(r))) {
        this.router.navigate(['/']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
