import { Aliases } from "./alias";
import { Delito } from "./delito";
import { formEgreso } from "./formEgreso";
import { CatDelitoModalidadPrometheusPFM } from "./catdelitomodalidadprometheuspfm";

export interface Detenidos{
     id : string;
     folioIngreso : number;
     folioEstatal : number;
     anioFolioIngreso : number;
     sedeSubsedeID : number;
     nombreSedeSubsede : string;
     nombreSedeSubsedeLargo : string;
     catEntidadFederativaID : number;
     entidadFederativa : string;     
     fehaHoraIngreso : Date;
     nombreDetenido : string;
     apellidoPaternoDetenido : string;
     apellidoMaternoDetenido : string;
     observaciones : string;
     nacionalidadID : number;
     nacionalidad : string;
     oficioRetencion : string;
     dependenciaDetencionID : string;
     dependenciaDetencion : string;
     rutaFirmaHuella : string;
     usuarioID : string;
     fchaAltaDelta : Date;
     fechaActualizacionDelta : Date;
     aliases : Aliases[];
     delitos : CatDelitoModalidadPrometheusPFM[];
     //clasificaciones:CatDelitoModalidadPrometheusPFM[];
    // public List<Delitos> Delitos { get; set; }
    // public List<Asignacion> Asignacion { get; set; }
    // public List<Egreso> Egreso { get; set; }
    // public List<Fichas> Fichas { get; set; }
    // public List<EstatusRegistro> EstatusRegistro { get; set; }
     borrado : number;
}


export class DetenidosDTO{

     id : string;
     folioIngreso : number;
     anioFolioIngreso : number;
     folioEstatal : number;
     sedeSubsedeID : number;
     nombreSedeSubsede : string;
     nombreSedeSubsedeLargo : string;
     catEntidadFederativaID : number;
     entidadFederativa : string;     
     fehaHoraIngreso : Date;
     nombreDetenido : string;
     apellidoPaternoDetenido : string;
     apellidoMaternoDetenido : string;
     observaciones : string;
     nacionalidadID : number;
     nacionalidad : string;
     oficioRetencion : string;
     dependenciaDetencionID : number;
     dependenciaDetencion : string;
     estatusRegistro : string;
     rutaFirmaHuella : string;
     usuarioID : string;
     fechaAltaDelta : Date;
     fechaActualizacionDelta : Date;
     aliases : Aliases[];
     delitos : CatDelitoModalidadPrometheusPFM[];
     //clasificaciones:CatDelitoModalidadPrometheusPFM[];
     aliasesEdit : string[];
     delitosEdit : number[];

     egreso : formEgreso[];
     catSeparoID : number;
     nombreSeparo:string[];
     enviado : boolean;
     otrosNombres : string;

     fichas: string[];
     
 

    constructor(detenido : DetenidosDTO){

        this.id = detenido.id;
        this.folioIngreso = detenido.folioIngreso;
        this.anioFolioIngreso = detenido.anioFolioIngreso
        this.folioEstatal = detenido.folioEstatal
        this.sedeSubsedeID = detenido.sedeSubsedeID 
        this.nombreSedeSubsede = detenido.nombreSedeSubsede
        this.nombreSedeSubsedeLargo  = detenido.nombreSedeSubsedeLargo
        this.catEntidadFederativaID  = detenido.catEntidadFederativaID
        this.entidadFederativa = detenido.entidadFederativa
        this.fehaHoraIngreso  = detenido.fehaHoraIngreso
        this.nombreDetenido = detenido.nombreDetenido
        this.apellidoPaternoDetenido = detenido.apellidoPaternoDetenido
        this.apellidoMaternoDetenido  = detenido.apellidoMaternoDetenido
        this.observaciones  = detenido.observaciones
        this.nacionalidadID  = detenido.nacionalidadID
        this.nacionalidad  = detenido.nacionalidad
        this.oficioRetencion  = detenido.oficioRetencion
        this.dependenciaDetencionID  = detenido.dependenciaDetencionID
        this.dependenciaDetencion   = detenido.dependenciaDetencion
        this.estatusRegistro = detenido.estatusRegistro
        this.rutaFirmaHuella = detenido.rutaFirmaHuella
        this.usuarioID  = detenido.usuarioID
        this.fechaAltaDelta  = detenido.fechaAltaDelta
        this.fechaActualizacionDelta  = detenido.fechaActualizacionDelta
        this.aliases  = detenido.aliases;
        this.delitos = detenido.delitos;
       // this.clasificaciones=detenido.clasificaciones;
        this.aliasesEdit  = detenido.aliasesEdit;
        this.delitosEdit = detenido.delitosEdit;
        this.egreso = detenido.egreso;
        this.catSeparoID = detenido.catSeparoID;
        this.nombreSeparo = detenido.nombreSeparo;
        this.enviado = detenido.enviado;
        this.otrosNombres = detenido.otrosNombres;
        this.fichas = detenido.fichas;
        

    } 
}

    
export class DetenidosDTO_Net{

    id : string;
    folioIngreso : number;
    anioFolioIngreso : number;
    sedeSubsedeID : number;
    nombreSedeSubsede : string;
    nombreSedeSubsedeLargo : string;
    catEntidadFederativaID : number;
    entidadFederativa : string;     
    fehaHoraIngreso : Date;
    nombreDetenido : string;
    apellidoPaternoDetenido : string;
    apellidoMaternoDetenido : string;
    observaciones : string;
    nacionalidadID : number;
    nacionalidad : string;
    oficioRetencion : string;
    dependenciaDetencionID : number;
    dependenciaDetencion : string;
    rutaFirmaHuella : string;
    usuarioID : string;
    fechaAltaDelta : Date;
    fechaActualizacionDelta : Date;
    aliases : Aliases[];
    delitos : CatDelitoModalidadPrometheusPFM[];
  // clasificaciones:CatDelitoModalidadPrometheusPFM[];
    catSeparoID : number;
    enviado : boolean;
    otrosNombres : string;

   constructor(detenido : DetenidosDTO){

       this.id = detenido.id;
       this.folioIngreso = detenido.folioIngreso;
       this.anioFolioIngreso = detenido.anioFolioIngreso
       this.sedeSubsedeID = detenido.sedeSubsedeID 
       this.nombreSedeSubsede = detenido.nombreSedeSubsede
       this.nombreSedeSubsedeLargo  = detenido.nombreSedeSubsedeLargo
       this.catEntidadFederativaID  = detenido.catEntidadFederativaID
       this.entidadFederativa = detenido.entidadFederativa
       this.fehaHoraIngreso  = detenido.fehaHoraIngreso
       this.nombreDetenido = detenido.nombreDetenido
       this.apellidoPaternoDetenido = detenido.apellidoPaternoDetenido
       this.apellidoMaternoDetenido  = detenido.apellidoMaternoDetenido
       this.observaciones  = detenido.observaciones
       this.nacionalidadID  = detenido.nacionalidadID
       this.nacionalidad  = detenido.nacionalidad
       this.oficioRetencion  = detenido.oficioRetencion
       this.dependenciaDetencionID  = detenido.dependenciaDetencionID
       this.dependenciaDetencion   = detenido.dependenciaDetencion
       this.rutaFirmaHuella = detenido.rutaFirmaHuella
       this.usuarioID  = detenido.usuarioID
       this.fechaAltaDelta  = detenido.fechaAltaDelta
       this.fechaActualizacionDelta  = detenido.fechaActualizacionDelta
       this.aliases  = detenido.aliases
       this.delitos = detenido.delitos
    //   this.clasificaciones=detenido.clasificaciones
       this.catSeparoID = detenido.catSeparoID
       this.enviado = detenido.enviado;
       this.otrosNombres = detenido.otrosNombres;
       

   }
}
