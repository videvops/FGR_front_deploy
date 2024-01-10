/*export interface CatFiscaliasDTO {
    catFiscaliaID: number;
    nombreFiscalia: string;
    catEntidadFederativaID: number;
    mnemonico: string;
    latitud: number;
    longitud: number;
}*/

export class CatFiscaliasDTO {
  catFiscaliaID: number;
  nombreFiscalia: string;
  catEntidadFederativaID: number;
  mnemonico: string;
  latitud: number;
  longitud: number;

  constructor(cat: CatFiscaliasDTO) {
    this.catFiscaliaID = cat.catFiscaliaID;
    this.nombreFiscalia = cat.nombreFiscalia;
    this.catEntidadFederativaID = cat.catEntidadFederativaID;
    this.mnemonico = cat.mnemonico;
    this.latitud = cat.latitud;
    this.longitud = cat.longitud;
  }
}
