import { Nombre } from "./detenidos";

export interface formBuscadorDetenidos{
    fechaIngresoInicial : Date;
    fechaIngresoFinal : Date;
    numeroDetenido : number;
    anio : number;
    nombre : Nombre;
    apPaterno : string;
    apMaterno : string;
    alias : string;
    nacionaliadID : number;
    oficioRetencion : string;
    dependenciaDetencionID : number;
    catDelitoID : number;
    oficioEgreso : string;
    fechaEgresoInicial : Date;
    fechaEgresoFinal : Date;
    motivoEgresoID : number;
    ficha : boolean;
}