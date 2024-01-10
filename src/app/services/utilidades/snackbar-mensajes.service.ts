import { Injectable, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { parsearErroresAPI } from 'src/app/utils/utils';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  @Input()
  errores: string[] = [];

  constructor(private snackbar: MatSnackBar) { }

  MensajeSwal(mensaje: string = "", icono: any = 'success', titulo = "Éxito") {
    Swal.fire({
      titleText: titulo,
      text: mensaje,
      icon: icono,
      confirmButtonText: 'Cerrar',
      heightAuto: false,
    });
  }

  MensajeSwalError(mensaje: string = "", icono: any = 'success', titulo = "Error") {
    Swal.fire({
      titleText: titulo,
      text: mensaje,
      icon: icono,
      confirmButtonText: 'Cerrar',
      heightAuto: false,
    });
  }

  async MensajeSwalConfirmacion(mensaje: string = "") {
    let resultado: boolean = false;
    const alerta = await Swal.fire({
      titleText: 'Confirmación',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      heightAuto: false,
    });
    if(alerta.isConfirmed) {
      resultado = true;
    }
    return resultado;
    // Swal.fire({
    //   title: mensaje,
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire('Salvado!', '', 'success')
    //   } else if (result.isDenied) {
    //     Swal.fire('No salvado', '', 'info')
    //   }
    // })
  }

  MensajeErrorStr(mensaje: string, accion: string) {
    this.snackbar.open(mensaje, accion, this.configSnackBarError())
  }

  MensajeError(errores: any, accion: string) {
    this.snackbar.open(parsearErroresAPI(errores)[0], accion, this.configSnackBarError())
  }

  MensajeSucceed(mensaje: string, accion: string) {
    this.snackbar.open(mensaje, accion, this.configSnackBarSucceed())
  }

  configSnackBarError(): MatSnackBarConfig {
    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'bottom';
    config.panelClass = ['red-snackbar'];
    return config;
  }
  configSnackBarSucceed(): MatSnackBarConfig {
    let config = new MatSnackBarConfig();
    config.duration = 3000;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'bottom';
    config.panelClass = ['green-snackbar'];
    return config;
  }

  MostrarArchivo(data)  {
    return Swal.fire({
      html: '<div id="noContextMenu"><object '+// //Proteccion contra dar clics style="position: relative;overflow: hidden;"   Quita las herramientas pero aun se puede guardar #toolbar=0&navpanes=0&scrollbar=0
      'data="'+data+'"'+
      'width="100%"'+
      'height="1000" style="margin-top: 20px;">'+
      '</object></div>', //<div id="cover-pr" style="position: absolute;top: 0; left: 0; bottom: 0;right: 0;"></div> Proteccion contra Dar clicks o seleccionar 
      heightAuto: true,
      width: "80%",
      allowOutsideClick: false,
      showConfirmButton:false,
      showCancelButton: true,
      cancelButtonText: "Cerrar",
      showCloseButton: true
    });
  }
}
