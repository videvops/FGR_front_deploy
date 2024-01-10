import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";
import { obtenerLlavesObjeto } from "./utils";

export function algoPorAqui() {
  //
}

// Validaciones para un Control.
export function fechaFutura(): ValidatorFn {
  return (control: AbstractControl) => {
      const valor = <Date>control.value;
      // if(!valor) {
      //   return {
      //     nullValidator: {
      //         mensaje: 'El dato está vacío'
      //     }
      //   }
      // }
      var fechaLimite = new Date();
      if(valor != null) {
        if(valor > fechaLimite) {
          return {
            fechaFutura: {
              mensaje: 'La fecha es mayor al día de hoy'
            }
          }
        }
      }
      return {}
  }
}

export function comprobarFecha(fecha: Date, diferenciaDias: number = 0) {
  return (control: AbstractControl) => {
    if(fecha != null && fecha !== undefined) {
      let fechaObjetivo = new Date(fecha);
      if(diferenciaDias != 0) {
        fechaObjetivo = new Date(fechaObjetivo.getFullYear(),
        fechaObjetivo.getMonth(), fechaObjetivo.getDate() + diferenciaDias);
      }
      const fechaIngresada = <Date> control.value;
      // Si la fecha no resulta mayor que la objetivo, se invalida.
      if(fechaIngresada <= fechaObjetivo) {
        return {
          fechaMayor: {
            mensaje: 'La fecha ingresada debería ser mayor.'
          }
        }
      }
      // Si la fecha no resulta menor que la objetivo, se invalida.
      // else if(fechaIngresada > fechaObjetivo) {
      //   return {
      //     fechaMenor: {
      //       mensaje: 'La fecha ingresada debería ser menor.'
      //     }
      //   }
      // }
    }
    return {}
  }
}

export function campoNoVacio(): ValidatorFn {
  return (control: AbstractControl) => {
      const valor = <string>control.value;
      // if(valor == null) {
      //   return {
      //     nullValidator: {
      //         mensaje: 'El campo está nulo'
      //     }
      //   }
      // }
      if(valor != null) {
        if(valor.length == 0 || valor.trim().length == 0) {
          return {
            campoVacio: {
                  mensaje: 'El campo está vacío'
              }
          }
        }
      }
      return {}
  }
}

export function validarSwitchDictoAutoAperturaJuicioOral(fecha: Date): ValidatorFn {
  return (control: AbstractControl) => {
    const valorAutoApertura = <boolean> control.value;
    // console.log("Valor");
    // console.log(valorAutoApertura);
    // console.log("Fecha");
    // console.log(fecha);

    if(valorAutoApertura !== null && valorAutoApertura !== undefined) {
      if(fecha !== null && fecha !== undefined) {
        if(valorAutoApertura) {
          return {
            fechaProcedimientoAbreviadoSentencia: true
          }
        }
      }
    }
    return null;
    //return {}
  }
}

export function validarFechaDictoProcedimientoAbreviado(valorAutoApertura: boolean): ValidatorFn {
  return (control: AbstractControl) => {
    const valorFechaAbrev = <Date> control.value;
    // console.log("Valor");
    // console.log(valorFechaAbrev);
    // console.log("Fecha");
    // console.log(valorAutoApertura);

    if(valorAutoApertura !== null && valorAutoApertura !== undefined) {
      if(valorFechaAbrev !== null && valorFechaAbrev !== undefined) {
        if(valorAutoApertura) {
          return {
            fechaAutoApertura: true
          }
        }
      }
    }
    return null;
    //return {}
  }
}

export function validarCantidadDelitos(cantidadCarpeta: number, cantidadDelitosCapturados: number): ValidatorFn {
  return (control: AbstractControl) => {
    const valorAutoApertura = <number> control.value;
    // console.log("cantidadCarpeta");
    // console.log(cantidadCarpeta);
    // console.log("cantidadDelitosCapturados");
    // console.log(cantidadDelitosCapturados);

    if(!esNuloOIndefinido(cantidadCarpeta)) {
      if(!esNuloOIndefinido(cantidadDelitosCapturados)) {
        if(cantidadDelitosCapturados < cantidadCarpeta) {
          return {
            delitosFaltantes: cantidadCarpeta - cantidadDelitosCapturados
          }
        }
      }
    }
    return null;
  }
}

// Validaciones para un Grupo de Controles.
export function validarSwitchHuboSuspension() {
  return (group: FormGroup) => {
    let controlHuboSuspension = group.get('dictoSuspensionCondicionalProceso');
    let valorHuboSuspension = controlHuboSuspension?.value;

    if (controlHuboSuspension != null) {
      if(!valorHuboSuspension) {
        return controlHuboSuspension.setErrors({sinSuspensionCondicional: true});
      }
    }
    return {}
  }
}

export function validarFechaDictoReapertura() {
  return (group: FormGroup) => {
    let controlFechaReapertura = group.get('fechaReaperturaProceso');
    let valorFechaDicto = group.get('fechaDictoSuspensionCondicionalProceso')?.value;
    let valorFechaReapertura = controlFechaReapertura?.value;

    if (valorFechaDicto != null && valorFechaReapertura != null) {
      let fechaDicto = new Date(valorFechaDicto);
      let fechaReapertura = new Date(valorFechaReapertura);
      if(fechaReapertura <= fechaDicto) {
        return controlFechaReapertura?.setErrors({fechaReaperturaMenor: true});
      }
    }
    return {}
  }
}

export function validarFechaDictoCumplimiento() {
  return (group: FormGroup) => {
    let controlFechaCumple = group.get('fechaCumplimientoSuspensionCondicionalProceso');
    let valorFechaDicto = group.get('fechaDictoSuspensionCondicionalProceso')?.value;
    let valorFechaCumple = controlFechaCumple?.value;

    if (valorFechaDicto != null && valorFechaCumple != null) {
      let fechaDicto = new Date(valorFechaDicto);
      let fechaReapertura = new Date(valorFechaCumple);
      if(fechaReapertura < fechaDicto) {
        return controlFechaCumple?.setErrors({fechaCumplimientoMenor: true});
      }
    }
    return {}
  }
}

export function validarFechaLibramientoMandamiento() {
  return (group: FormGroup) => {
    let controlFechaLibramiento = group.get('fechaLibramientoMandamiento');
    let valorFechaMandamiento = group.get('fechaSolicitudMandamientoJudicial')?.value;
    let valorFechaLibramiento = controlFechaLibramiento?.value;

    if (valorFechaMandamiento != null && valorFechaLibramiento != null) {
      let fechaMandamiento = new Date(valorFechaMandamiento);
      let fechaLibramiento = new Date(valorFechaLibramiento);
     
      if(fechaLibramiento < fechaMandamiento) {

        return controlFechaLibramiento?.setErrors({fechaLibramientoMandamientoMenor: true});
      }
    }
    return {}
  }
}




export function validarFechaSolicitud() {
  return (group: FormGroup) => {
   
    let controlFechaAperturaCarpeta = group.get('fechaAperturaCarpeta');
    let valorFechaMandamiento = group.get('fechaSolicitudMandamientoJudicial')?.value;
    let valorFechaCarpeta = controlFechaAperturaCarpeta?.value;
     if (valorFechaMandamiento != null && valorFechaCarpeta != null) {
      let fechaMandamiento = new Date(valorFechaMandamiento);
      let fechacarpeta = new Date(valorFechaCarpeta);
     
      if( fechaMandamiento > fechacarpeta) {

        return controlFechaAperturaCarpeta?.setErrors({fechacarpetaMenor: true});
      }
    }
    return {}
  }
}






export function validarFechaCumplimientoMandamiento() {

 

  return (group: FormGroup) => {
    let controlFechaCmplimiento = group.get('fechaCumplimientoMandamiento');
    let valorFechaLibramiento= group.get('fechaLibramientoMandamiento')?.value;
    let valorFechaCumplimiento = controlFechaCmplimiento?.value;

 
   

    if (valorFechaCumplimiento!= null && valorFechaLibramiento != null) {
      let fechaCumplimiento = new Date(valorFechaCumplimiento);
      let fechaLibramiento = new Date(valorFechaLibramiento);
     
      if(fechaCumplimiento <fechaLibramiento ) {
        return controlFechaCmplimiento?.setErrors({fechaCumplimientoMandamientoMenor: true});
      }

    }

    let controlEstatusMandamiento = group.get('catEstatusMandamientoJudicialID');
    let valorEstatusMandamiento = controlEstatusMandamiento?.value;
    if(valorEstatusMandamiento>1 && valorFechaCumplimiento!=null){

      return controlEstatusMandamiento?.setErrors({estatusMandamientoInvalido: true});
    
    }

    if(valorEstatusMandamiento==1 && valorFechaCumplimiento==null){

      return controlFechaCmplimiento?.setErrors({fechaCumplimientoMandamientoObligatoria: true});
    
    }




    return {}
  }
}

// Validaciones para SENTENCIA.
export function validarFechaAudienciaJuicio() {
  return (group: FormGroup) => {
    let controlFechaAudienciaJuicio = group.get('fechaCelebracionAudienciaJuicio');
    let valorFechaDictoProcedimientoAbr = group.get('fechaDictoProcedimientoAbreviado')?.value;
    let valorFechaAudienciaJuicio = controlFechaAudienciaJuicio?.value;

    if (valorFechaAudienciaJuicio != null && valorFechaDictoProcedimientoAbr != null) {
      let fechaDictoProcAbr = new Date(valorFechaDictoProcedimientoAbr);
      let fechaAudienciaJ = new Date(valorFechaAudienciaJuicio);
      if(fechaDictoProcAbr < fechaAudienciaJ) {
        return controlFechaAudienciaJuicio?.setErrors({fechaCelebracionAudienciaJuicioMenor: true});
      }
    }
    return {}
  }
}

// export function validarFechaSolicitud() {
//   return (group: FormGroup) => {
//     debugger;
//     let controlFechacarpeta = group.get('fechaAperturaCarpeta');
//     let valorFechasolicitud = group.get('fechaSolicitudMandamientoJudicial')?.value;
//     let valorFechasolicitudd = controlFechacarpeta?.value;

//     if (valorFechasolicitud != null && valorFechasolicitudd != null) {
//       let fechasol= new Date(valorFechasolicitud);
//       let fechacarpeta = new Date(valorFechasolicitudd);
//       if(fechasol <  fechacarpeta) {
//         return controlFechacarpeta?.setErrors({fechaCumplimientocarpetaMenor: true});
//       }
//     }
//     return {}
//   }
// }






  //validación switch de sentencia (derivada de procedimiento) para solicitar la fecha de manera obligatoria si este está en true
export function validarSwitchProcedimientoAbreviado() {
  return (grupo: FormGroup) => {
    let controlSentenciaDerivadaProcedimiento = grupo.get('sentenciaDerivadaProcedimientoAbreviado');
    let controlfechaDictoProcedimientoAbreviado = grupo.get('fechaDictoProcedimientoAbreviado');

    let valorSentenciaDerivadaProcedimiento = controlSentenciaDerivadaProcedimiento?.value;
    let valorfechaDictoProcedimientoAbreviado = controlfechaDictoProcedimientoAbreviado?.value;

    var listaErrores = {};

    if (valorSentenciaDerivadaProcedimiento != null) {
      if(valorSentenciaDerivadaProcedimiento && valorfechaDictoProcedimientoAbreviado === null) {
        listaErrores = {...listaErrores, sinfechaDictoProcedimientoAbreviado: true};
      }
    }

    if(obtenerLlavesObjeto(listaErrores).length > 0) {
      return controlSentenciaDerivadaProcedimiento?.setErrors(listaErrores);
    } else {
      return controlSentenciaDerivadaProcedimiento?.setErrors(null);
    }
   
  }
}
///terminan validadores sentencia



export function validarEstatusCumplimientoMandamiento() {


  return (group: FormGroup) => {

 let controlFechaCmplimiento = group.get('fechaCumplimientoMandamiento');
 let valorFechaCumplimiento = controlFechaCmplimiento?.value;
 let controlEstatusMandamiento = group.get('catEstatusMandamientoJudicialID');
 let valorEstatusMandamiento = controlEstatusMandamiento?.value;

 if(valorFechaCumplimiento!=null&&valorEstatusMandamiento!=1 ){
  return controlEstatusMandamiento?.setErrors({estatusMandamientoInvalido: true});
 }

 if(valorEstatusMandamiento==1 && valorFechaCumplimiento==null){

  return controlFechaCmplimiento?.setErrors({fechaCumplimientoMandamientoObligatoria: true});

}

if(valorEstatusMandamiento>1 && valorFechaCumplimiento!=null){
  return controlFechaCmplimiento?.setErrors({fechaCumplimientoMandamientoVacia: true});
}
 return {}
}
  

}

export function validarSwitchBrindoAtencion() {
  return (grupo: FormGroup) => {
    // Obtengo los controles que me interesan validar.
    let controlHuboAtencion = grupo.get('brindoAlgunTipoAtencion');
    let formularioAtenciones = grupo.get('atenciones');

    let valorHuboAtencion = controlHuboAtencion?.value;
    let valorFormularioAtencion = formularioAtenciones?.value;

    var listaErrores = {};
    // console.log("Hubo atenciones");
    // console.log(valorHuboAtencion);
    // console.log("Valor del form");
    // console.log(valorFormularioAtencion);

    if(valorHuboAtencion != null && valorFormularioAtencion != null) {
      // Si el valor fue seleccionado porque se brindó una atención, se verifican 2 posibles escenarios:
      if(valorHuboAtencion) {
        // 1.- Si el valor del formulario está vacío, es porque se inicializa apenas el formulario completo.
        // Se debe lanzar error de que se deben acompletar los campos.
        if(valorFormularioAtencion == "") {
          listaErrores = {...listaErrores, faltanDatosAtencion: true};
        } else {
          // 2.- El formulario ya fue inicializado, pero hay que hacer que todos sus campos ya estén llenos.
          if(valorFormularioAtencion.catSentidoConclusionAtencionID == 0 || esNuloOIndefinido(valorFormularioAtencion.catSentidoConclusionAtencionID)) {
            listaErrores = {...listaErrores, faltaSentidoConclusion: true};
          }
          if(valorFormularioAtencion.catTipoAtencionID == 0 || esNuloOIndefinido(valorFormularioAtencion.catTipoAtencionID)) {
            listaErrores = {...listaErrores, faltaTipoAtencion: true};
          }
          if(valorFormularioAtencion.fechaConclusionAtencion == null) {
            listaErrores = {...listaErrores, faltaFechaConclusion: true};
          }
          if(valorFormularioAtencion.fechaInicioAtencion == null) {
            listaErrores = {...listaErrores, faltaFechaInicio: true};
          }
          // ANULADO en acuerdo al Taller para la revisión de reglas de negocio del SENAP llevado a cabo el día 10 de septiembre del 2021.
          // if(valorFormularioAtencion.numeroAtencion == "") {
          //   listaErrores = {...listaErrores, faltaNumeroAtencion: true};
          // }
        }
      }
    }

    // console.log("Errores finales");
    // console.log(listaErrores);

    if(obtenerLlavesObjeto(listaErrores).length > 0) {
      // Se parcha al switch para que se invalide el formulario completo de noticia criminal.
      return controlHuboAtencion?.setErrors(listaErrores);
    } else {
      return controlHuboAtencion?.setErrors(null);
    }

    /*let controlHuboEtapaIntermedia = grupo.get('huboCelebracionAudienciaIntermedia');
    let controlFechaIntermedia = grupo.get('fechaCelebracionAudienciaIntermedia');
    let controlHuboPruebas = grupo.get('huboPresentacionMediosPrueba');
    let controlHuboAcuerdos = grupo.get('contoAcuerdosProbatorios');
    let controlHuboAutoApertura = grupo.get('dictoAutoAperturaJuicioOral');

    let valorHuboEtapaIntermedia = controlHuboEtapaIntermedia?.value;
    let valorFechaIntermedia = controlFechaIntermedia?.value;
    let valorHuboPruebas = controlHuboPruebas?.value;
    let valorHuboAcuerdos = controlHuboAcuerdos?.value;
    let valorHuboAutoApertura = controlHuboAutoApertura?.value;

    var listaErrores = {};

    if (valorHuboEtapaIntermedia != null) {
      if(valorHuboEtapaIntermedia && valorFechaIntermedia === null) {
        listaErrores = {...listaErrores, sinFechaIntermedia: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboPruebas != null) {
      if(valorHuboPruebas && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayPruebas: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboAcuerdos != null) {
      if(valorHuboAcuerdos && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayAcuerdos: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboAutoApertura != null) {
      if(valorHuboAutoApertura && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayAutoApertura: true};
      }
    }

    if(obtenerLlavesObjeto(listaErrores).length > 0) {
      return controlHuboEtapaIntermedia?.setErrors(listaErrores);
    } else {
      return controlHuboEtapaIntermedia?.setErrors(null);
    }
    */
   
  }
}



export function validarSwitchHuboEtapaIntermedia() {
  return (grupo: FormGroup) => {
    let controlHuboEtapaIntermedia = grupo.get('huboCelebracionAudienciaIntermedia');
    let controlFechaIntermedia = grupo.get('fechaCelebracionAudienciaIntermedia');
    let controlHuboPruebas = grupo.get('huboPresentacionMediosPrueba');
    let controlHuboAcuerdos = grupo.get('contoAcuerdosProbatorios');
    let controlHuboAutoApertura = grupo.get('dictoAutoAperturaJuicioOral');

    let valorHuboEtapaIntermedia = controlHuboEtapaIntermedia?.value;
    let valorFechaIntermedia = controlFechaIntermedia?.value;
    let valorHuboPruebas = controlHuboPruebas?.value;
    let valorHuboAcuerdos = controlHuboAcuerdos?.value;
    let valorHuboAutoApertura = controlHuboAutoApertura?.value;

    var listaErrores = {};

    if (valorHuboEtapaIntermedia != null) {
      if(valorHuboEtapaIntermedia && valorFechaIntermedia === null) {
        listaErrores = {...listaErrores, sinFechaIntermedia: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboPruebas != null) {
      if(valorHuboPruebas && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayPruebas: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboAcuerdos != null) {
      if(valorHuboAcuerdos && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayAcuerdos: true};
      }
    }

    if (valorHuboEtapaIntermedia != null && valorHuboAutoApertura != null) {
      if(valorHuboAutoApertura && !valorHuboEtapaIntermedia) {
        listaErrores = {...listaErrores, hayAutoApertura: true};
      }
    }

    if(obtenerLlavesObjeto(listaErrores).length > 0) {
      return controlHuboEtapaIntermedia?.setErrors(listaErrores);
    } else {
      return controlHuboEtapaIntermedia?.setErrors(null);
    }
   
  }
}

export function validarCampoEtapaIntermedia() {
  return (grupo: FormGroup) => {
    let controlHayPruebas = grupo.get('huboPresentacionMediosPrueba');
    let controlMediosPrueba = grupo.get('mediosPrueba');

    let valorHayPruebas = controlHayPruebas?.value;
    let valorMediosPrueba = controlMediosPrueba?.value;

    var listaErrores = {};

    if (valorHayPruebas != null && valorMediosPrueba != null) {
      if(valorHayPruebas && valorMediosPrueba.length == 0) {
        listaErrores = {...listaErrores, campoVacio: true};
      }
    }

    if(obtenerLlavesObjeto(listaErrores).length > 0) {
      return controlMediosPrueba?.setErrors(listaErrores);
    } else {
      return controlMediosPrueba?.setErrors(null);
    }
  }
}

export function esNuloOIndefinido(objeto: any): boolean {
  return objeto === null || objeto === undefined;
}