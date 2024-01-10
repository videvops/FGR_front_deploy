import { ValidacionPlantilla } from "./validacion-plantilla.model";

export interface ValidacionPlantillas {
  fiscaliaStatusID: number;
  fiscaliaCargaID: number;
  statusCarga: number;
  intentosValidacion: number;
  statusValidacionGeneral: number;
  statusValidacionEspecifica: number;
  validacionPlantilla: ValidacionPlantilla[];
  actualizaPlantilla: boolean;
}
