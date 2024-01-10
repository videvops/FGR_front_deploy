import { HttpParams } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { CatPlantillas } from "./enums";

export function toBase64(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function parsearErroresAPI (response: any): string[] {
  const resultado: string[] = [];

  if (response.error) {
    if (typeof response.error === 'string') {
      resultado.push(response.error)
    } else if (Array.isArray(response.error)) {
      response.error.forEach((valor: any) => resultado.push(valor.description));
    } else {
      const mapaErrores = response.error.errors;
      if(mapaErrores !== null && mapaErrores !== undefined) {
        const entradas = Object.entries(mapaErrores);
        entradas.forEach((arreglo: any[]) => {
          const campo = arreglo[0];
          arreglo[1].forEach((mensajeError: string) => {
            resultado.push(`${ campo }: ${ mensajeError }`);
          });
        });
      }
    }
  }

  return resultado;
}

// export function formatearFecha(date: Date) {
//   const formato = new Intl.DateTimeFormat('en', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit'
//   });

//   const [
//     { value: month },,
//     { value: day },,
//     { value: year }
//   ] = formato.formatToParts(date);

//   return `${year}-${month}-${day}`;
// }
export function formatearFecha(date: Date | string | undefined, soloFecha: boolean = false) {
  if(date == null || date === undefined) {
      return "";
  }
  date = new Date(date);
  const formato = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
  });

  const [
      {value: day},
      ,
      {value: month},
      ,
      {value: year},
      ,
      {value: hour},
      ,
      {value: minute},
      ,
      {value: second}
  ] = formato.formatToParts(date);
  // const valores = formato.formatToParts(date);
  // [
  // 0: {type: "month", value: "02"}
  // 1: {type: "literal", value: "/"}
  // 2: {type: "day", value: "17"}
  // 3: {type: "literal", value: "/"}
  // 4: {type: "year", value: "2021"}
  // 5: {type: "literal", value: ", "}
  // 6: {type: "hour", value: "09"}
  // 7: {type: "literal", value: ":"}
  // 8: {type: "minute", value: "56"}
  // 9: {type: "literal", value: ":"}
  // 10: {type: "second", value: "33"}
  // ]
  if(soloFecha) {
    return year + "-" + month + "-" + day;
  }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  //return day + "/" + month + "/" + year;
}

export function construirFormData(modelo: Object): FormData {
  const llavesEntradas: Array<{llave: string, valor: Object}> = Object.entries(modelo).map(entrada => {
  return { llave: entrada[0], valor: entrada[1] }
  });

  let formData = new FormData();
  llavesEntradas.forEach(prop => {
      // Si no es un modelo que tenga otros valores, es una propiedad del mismo.
      //if (!listaModelos.includes(prop.llave)) {
      if (prop.valor instanceof Object == false) {
        // Para que el back reconozca nulos, se mandan vacíos los valores.
        if(prop.valor == null) {
          formData.append(prop.llave, "");
        } else {
          formData.append(prop.llave, prop.valor.toString());
        }
      }
      else
      {
        // Si es una fecha, se le da formato.
        //if ( Object.prototype.toString.call(prop.valor) === "[object Date]" ) {
        if(prop.valor instanceof Date){
          formData.append(prop.llave, formatearFecha(prop.valor));
        }
        else
        // Sino, es un objeto completo con otras propiedades, y se setea.
        {
          formData.append(prop.llave, JSON.stringify (prop.valor));
        }
      }
  });
  return formData;
}

export function construirHttpParams(modelo: Object): HttpParams {
  var params = new HttpParams();
  const llavesEntradas: Array<{llave: string, valor: Object}> = Object.entries(modelo).map(entrada => {
    return { llave: entrada[0], valor: entrada[1] }
    });
  llavesEntradas.forEach(prop => {
    if (prop.valor instanceof Object == false) {
      // Para que el back reconozca nulos, se mandan vacíos los valores.
      if(prop.valor == null) {
        params = params.append(prop.llave, "");
      } else {
        params = params.append(prop.llave, prop.valor.toString());
      }
    }
  });
  return params;
}

export function inicializarPaginador(paginador: MatPaginator) {
  paginador._intl.itemsPerPageLabel = "Registros por página";
  paginador._intl.nextPageLabel = "Siguiente";
  paginador._intl.previousPageLabel = "Anterior";
  paginador._intl.firstPageLabel = "Primera página";
  paginador._intl.lastPageLabel = "Última página";

  paginador._intl.getRangeLabel = function (page: number, pageSize: number, length: number) {
  if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  // Si el ínidce de inicio excede la longitud de la lista,
  // no se debe intentar y arreglar el índice final del fin.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
  return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };
}
/*export function utf8_decode(strData:string): string{
  const tmpArr = []
  let i = 0
  let c1 = 0
  let seqlen = 0
  strData += ''
  while (i < strData.length) {
    c1 = strData.charCodeAt(i) & 0xFF
    seqlen = 0
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F)
      seqlen = 1
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F)
      seqlen = 2
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F)
      seqlen = 3
    } else {
      c1 = (c1 & 0x07)
      seqlen = 4
    }
    for (let ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
    }
    if (seqlen === 4) {
      c1 -= 0x10000
      tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
      tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
    } else {
      tmpArr.push(String.fromCharCode(c1))
    }
    i += seqlen
  }
  return tmpArr.join('')
}*/

export function quitaNull (dato:any){
  if(dato==null){
    return "";
  }
  else{
      return dato.toString();
  }
}

export function obtenerLlavesObjeto(objeto: Object): Array<{llave: string, valor: Object}> {
  const llavesEntradas: Array<{llave: string, valor: Object}> = Object.entries(objeto).map(entrada => {
    return { llave: entrada[0], valor: entrada[1] }
    });
  return llavesEntradas;
}

export function calcularNumeroElementoTabla(pagina: number, registrosPorPagina: number, indice: number): number {
  return (pagina - 1) * registrosPorPagina + indice;
}

export function convertirAUTF8(dato: string) {
  return decodeURIComponent(escape(dato));
}

export function convertirFormatoHora(horas: number, minutos: number, segundos: number = -1): string {
  let cadena = "";
  let cadenaHoras = horas.toString();
  for(let i = cadenaHoras.length; i < 2; i++) {
    cadenaHoras = '0' + cadenaHoras;
  }
  cadena += cadenaHoras;
  let cadenaMinutos = minutos.toString();
  for(let i = cadenaMinutos.length; i < 2; i++) {
    cadenaMinutos = '0' + cadenaMinutos;
  }
  cadena += ":" + cadenaMinutos;
  if(segundos >= 0) {
    let cadenaSegundos = segundos.toString();
    for(let i = cadenaSegundos.length; i < 2; i++) {
      cadenaSegundos = '0' + cadenaSegundos;
    }
    cadena += ":" + cadenaSegundos;
  }
  return cadena;
}

export function esNumero(cadena: string): boolean {
  let numeros: string = '0123456789.';
  let puntoEncontrado = false;
  for(let i = 0; i < cadena.length; i++) {
    let simbolo = cadena.charAt(i);
    if(!numeros.includes(simbolo)) {
      return false;
    }
    if(simbolo == '.') {
      // Sólo se debería encontrar 1 sola vez el punto decimal.
      if(puntoEncontrado) {
        return false;
      }
      puntoEncontrado = true;
    }
  }
  return true
}

export function getPlantilla(catPlantillasID: number): string {
  var fileName = "file";
  var date: Date = new Date();
  console.log(date.getDate());
  var dateStr = getNormal(date.getDate()) + "-" + getNormal(date.getMonth() + 1) + "-" + date.getFullYear();
  var timeStr = getNormal(date.getHours()) + "-" + getNormal(date.getMinutes()) + "-" + getNormal(date.getSeconds());
  switch (catPlantillasID) {
    case CatPlantillas.NoticiaCriminal:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.NoticiaCriminal] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.CarpetaInvestigacion:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.CarpetaInvestigacion] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.ActosInvestigacion:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.ActosInvestigacion] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Delitos:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Delitos] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Aseguramientos:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Aseguramientos] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.VictimasDelito:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.VictimasDelito] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.ImputadoDelito:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.ImputadoDelito] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.VictimaImputado:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.VictimaImputado] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Determinacion:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Determinacion] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Proceso:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Proceso] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.MandamientosJudiciales:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.MandamientosJudiciales] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.InvestigacionComplementaria:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.InvestigacionComplementaria] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.MedidasCautelares:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.MedidasCautelares] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.EtapaIntermedia:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.EtapaIntermedia] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.MASC:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.MASC] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Sobreseimiento:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Sobreseimiento] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.SuspensionCondicional:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.SuspensionCondicional] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
    case CatPlantillas.Sentencia:
        fileName = "detalle-validacion_" + CatPlantillas[CatPlantillas.Sentencia] + "_" + dateStr + "_" + timeStr + ".csv";
      break;
  }
  return fileName;
}

export function getNormal(origin: number) {
  if (origin < 10)
    return "0" + origin.toString();
  else
    return origin.toString();
}
