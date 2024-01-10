import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MensajesService } from '../utilidades/snackbar-mensajes.service';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadInterceptorService implements HttpInterceptor {

  constructor(private seguridadService: SeguridadService, private router: Router, private mensajesService: MensajesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.seguridadService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 0) {
            this.mensajesService.MensajeErrorStr('Algo ha fallado! Intente de nuevo','Error');
          } else if (err.status == 401) {
            this.mensajesService.MensajeErrorStr('Tiene que iniciar sesión nuevamente!','Error');
            this.seguridadService.cleanSession();
            this.router.navigate(['/login']);
          }
          return;
        }
      }
    ));
  }
}
