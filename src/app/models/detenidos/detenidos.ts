import { Aliases } from "./alias";
import { formEgreso } from "./formEgreso";
import { CatDelitoModalidadPrometheusPFM } from "./catdelitomodalidadprometheuspfm";
import { NumberValueAccessor } from "@angular/forms";
import { Local } from "protractor/built/driverProviders";
import { faThinkPeaks } from "@fortawesome/free-brands-svg-icons";

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
export class Nombre {
    nombre : string;
    apellidoPaterno: string;
    apellidoMaterno: string; 
    
    constructor(nombre:string, apellidoPaterno:string ,apellidoMaterno:string ){
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
    }
}
export class OtroNombre {
    nombre : string;
    apellidoPaterno: string;
    apellidoMaterno: string; 
    borrado : boolean; 
    
    constructor(nombre:string, apellidoPaterno:string ,apellidoMaterno:string ){
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.borrado = false ;
    }
}
export class Familiar{
    nombreFamiliar: Nombre; 
    parentesco: string ;
    telefono : string; 
    
    constructor(nombre : Nombre, parentesco:string, telefono:string){
        this.nombreFamiliar= nombre; 
        this.parentesco = parentesco; 
        this.telefono = telefono;
    }
}
export class Domicilio {
    Calle: string;
    Numero: string;
    CodigoPostal : string;
    LocalidadID : number ;
    Localidad : string ;
    MunicipioID : number; 
    Municipio : string; 
    EntidadID : number;   
    Entidad : string;

    constructor(Calle : string, Numero: string ,CodigoPostal : string,
         LocalidadID : number , Localidad : string, 
         MunicipioID : number, Municipio : string, 
         EntidadID : number, Entidad : string ){ 
        this.Calle = Calle;
        this.Numero = Numero ;
        this.CodigoPostal = CodigoPostal;
        this.LocalidadID = LocalidadID;
        this.Localidad = Localidad;
        this.MunicipioID = MunicipioID;
        this.Municipio = Municipio;
        this.EntidadID = EntidadID ;
        this.Entidad = Entidad ; 
    }
}
export class Aliases_ {
    Alias : string ; 
    FechaAltaDelta : Date ; 
    FechaActualizacionDelta : Date ; 
    Borrado : number ; 
    constructor (Alias : string , FechaAltaDelta: Date, FechaActualizacionDelta: Date, Borrado: number   ){
        this.Alias = Alias; 
        this.FechaAltaDelta = FechaAltaDelta ;
        this. FechaActualizacionDelta = FechaActualizacionDelta ;
        this.Borrado = Borrado; 
    }
}
export class Delitos_{
    CatDelitoID : number; 
    Delito : string; 
    CatClasificacionDelitoID : number;
    Clasificacion : string; 
    FechaAltaDelta : Date ; 
    FechaActualizacionDelta : Date ;
    Borrado :number ; 

    constructor(    
        CatDelitoID : number,
        Delito : string,
        CatClasificacionDelitoID : number,
        Clasificacion : string,
        FechaAltaDelta : Date , 
        FechaActualizacionDelta : Date ,
        Borrado :number , ){
            this.CatDelitoID=CatDelitoID; 
            this.Delito = Delito; 
            this.CatClasificacionDelitoID = CatClasificacionDelitoID; 
            this.Clasificacion =Clasificacion ; 
            this.FechaAltaDelta =FechaAltaDelta ; 
            this.FechaActualizacionDelta = FechaActualizacionDelta; 
            this.Borrado =Borrado ;
    }
}
export class Detenido_Save{
    FechaHoraIngreso: Date;
    NumeroOficio: string ;
    CatSeparoID : number ;
    //
    DependenciaDetencion : string;
    OtraDependenciaDetencion: string ;
    noProporcionada: boolean;
    Delitos : CatDelitoModalidadPrometheusPFM[];
    // DATOS DEL DETENIDO
    NombreDetenido: Nombre;
    OtrosNombres : OtroNombre[]; 
    isRelevante :boolean;
    Aliases : Aliases[];
    NacionalidadDetenido : number ;
    Sexo : number ;
    FechaNacimiento :Date ; 
    Edad :number; 
    Rfc: string ;
    // LUGAR DE NACIMIENTO
    Entidad : number ;
    Municipio: number; 
    // DOMICILIO PARTICULAR
    DomicilioParticular : Domicilio;
    // DATOS DEL FAMILIAR
    DatosFamiliar : Familiar ;
    //OBSERVACIONES
    Observaciones : string;
    // DATOS DE EGRESO 
    FechaEgreso : Date ; 
    NumeroOficioEgreso : string ; 
    MotivoEgreso : string ;
    ObservacionesEgreso : string; 


    
    // COSNTRUCTOR 
    constructor ( NombreDetenido: Nombre, OtrosNombres : OtroNombre [], DomicilioParticular : Domicilio, DatosFamiliar : Familiar , Detenido : DetenidosDTO_Net){
        // DATOS DEL OFICIO
        this.FechaHoraIngreso = Detenido.fechaHoraIngreso ;
        this.NumeroOficio = Detenido.numeroOficio;
        this.CatSeparoID = Detenido.catSeparoID;
        //
        this.DependenciaDetencion = Detenido.dependenciaDetencion;
        this.OtraDependenciaDetencion = Detenido.otraAutoridadTextBox;
        this.noProporcionada = Detenido.noProporcionada; 
        this.Delitos = Detenido.delitos;
        // DATOS DEL DETENIDO
        this.NombreDetenido = NombreDetenido;
        this.OtrosNombres = OtrosNombres;
        this.isRelevante = Detenido.isRelevante;        
        this.Aliases = Detenido.aliases;
        this.NacionalidadDetenido = Detenido.nacionalidadDetenido;
        this.Sexo = Detenido.sexoDetenido; 
        this.FechaNacimiento = Detenido.fechaDeNacimiento ;
        this.Edad = Detenido.edadDetenido;
        this.Rfc = Detenido.rfcDetenido;
        // LUGAR DE NACIMIENTO
        this.Entidad = Detenido.entidadNacimiento ; 
        this.Municipio = Detenido.municipioNacimiento; 
        // DOMICILIO
        this.DomicilioParticular = DomicilioParticular;
        // DATOS DEL FAMILIAR
        this.DatosFamiliar = DatosFamiliar;
        // OBSERVACIONES
        this.Observaciones = Detenido.observaciones;
        // DATOS DEL EGRESO DEL DETENIDO
        this.FechaEgreso = Detenido.fechaEgreso || null ;
        this.NumeroOficioEgreso = Detenido.numeroOficioEgreso || "";
        this.MotivoEgreso = Detenido.motivoEgreso || "";
        this.ObservacionesEgreso = Detenido.observacionesEgreso || "";
    }

}
export class Detenido_update {
    Id : string; 
    FolioIngreso : number; 
    AnioFolioIngreso : number ;
    CatSeparoID : number ;
    SedeSubsedeID : number ; 
    NombreSedeSubsede : string; 
    NombreSedeSubsedeLargo  : string; 
    CatEntidadFederativaID  : number ; 
    EntidadFederativa  : string; 
    FehaHoraIngreso  : Date ; 
    NombreDetenido  : Nombre ;
    OtrosNombres  : Nombre []; 
    ObservacionesDetenido  : string; 
    NacionalidadID  : number ; 
    Nacionalidad  : string; 
    Familiar : Familiar  ;
    isRelevant  : boolean; 
    Sexo  : string; 
    Rfc  : string; 
    Edad: number; 
    FechaNacimiento  : Date ; 
    Entidad  : number; 
    Municipio : number ;
    DomicilioParticular  :Domicilio; 
    SenasParticulares  : string; 
    OficioRetencion  : string; 
    DependenciaDetencionID  : number ; 
    DependenciaDetencion  : string; 
    RutaFirmaHuella  : string; 
    UsuarioID  : string; 
    FechaAltaDelta  :Date ; 
    FechaActualizacionDelta : Date; 
    Aliases : Aliases_ []; 
    Delitos  : Delitos_ []; 
    Asignacion :  any ; 
    Egreso  : any ;
    Fichas  : any ;
    EstatusRegistro : any ; 
    Borrado  : number ; 
    AliasesEdit : string [];
    DelitosEdit  : number []; 

    constructor (    
        Id : string , 
        FolioIngreso : number , 
        AnioFolioIngreso : number  ,
        CatSeparoID : number  ,
        SedeSubsedeID : number  , 
        NombreSedeSubsede : string , 
        NombreSedeSubsedeLargo  : string , 
        CatEntidadFederativaID  : number  , 
        EntidadFederativa  : string , 
        FehaHoraIngreso  : Date  , 
        NombreDetenido  : Nombre  ,
        OtrosNombres  : Nombre [] , 
        ObservacionesDetenido  : string , 
        NacionalidadID  : number  , 
        Nacionalidad  : string , 
        Familiar : Familiar   ,
        isRelevant  : boolean , 
        Sexo  : string , 
        Rfc  : string , 
        Edad : number ,
        FechaNacimiento  : Date  , 
        Entidad  : number ,
        Municipio : number ,
        DomicilioParticular  :Domicilio , 
        SenasParticulares  : string , 
        OficioRetencion  : string , 
        DependenciaDetencionID  : number  , 
        DependenciaDetencion  : string , 
        RutaFirmaHuella  : string , 
        UsuarioID  : string , 
        FechaAltaDelta  :Date  , 
        FechaActualizacionDelta : Date , 
        Aliases : Aliases_ [] , 
        Delitos  : Delitos_ [] , 
        Asignacion :  any  , 
        Egreso  : any  ,
        Fichas  : any  ,
        EstatusRegistro : any  , 
        Borrado  : number  , 
        AliasesEdit : string [] ,
        DelitosEdit  : number []  ) {

            this.Id = Id;
            this.FolioIngreso = FolioIngreso;
            this.AnioFolioIngreso =AnioFolioIngreso ;
            this.CatSeparoID = CatSeparoID;
            this.SedeSubsedeID =SedeSubsedeID ;
            this.NombreSedeSubsede = NombreSedeSubsede;
            this.NombreSedeSubsedeLargo =NombreSedeSubsedeLargo ;
            this.CatEntidadFederativaID =CatEntidadFederativaID ;
            this.EntidadFederativa = EntidadFederativa;
            this.FehaHoraIngreso = FehaHoraIngreso;
            this.NombreDetenido = NombreDetenido;
            this.OtrosNombres = OtrosNombres;
            this.ObservacionesDetenido = ObservacionesDetenido ;
            this.NacionalidadID = NacionalidadID;
            this.Nacionalidad = Nacionalidad;
            this.Familiar = Familiar;
            this.isRelevant = isRelevant;
            this.Sexo = Sexo;
            this.Rfc = Rfc;
            this.Edad = Edad; 
            this.FechaNacimiento =FechaNacimiento ;
            this.Entidad =Entidad ;
            this.Municipio = Municipio; 
            this.DomicilioParticular = DomicilioParticular;
            this.SenasParticulares =SenasParticulares ;
            this.OficioRetencion = OficioRetencion;
            this.DependenciaDetencionID = DependenciaDetencionID;
            this.DependenciaDetencion = DependenciaDetencion; 
            this.RutaFirmaHuella =RutaFirmaHuella ;
            this.UsuarioID =UsuarioID ;
            this.FechaAltaDelta = FechaAltaDelta;
            this.FechaActualizacionDelta = FechaActualizacionDelta;
            this.Aliases = Aliases ;
            this.Delitos = Delitos;
            this.Asignacion = Asignacion ;
            this.Egreso = Egreso;
            this.Fichas = Fichas;
            this.EstatusRegistro =EstatusRegistro ;
            this.Borrado = Borrado;
            this.AliasesEdit = AliasesEdit;
            this.DelitosEdit = DelitosEdit;

    }
}
export class DetenidosDTO{

    id : string;
    folioIngreso : number;
    anioFolioIngreso : number;
    numeroOficio : string ;
    folioEstatal : number;
    sedeSubsedeID : number;
    nombreSedeSubsede : string;
    nombreSedeSubsedeLargo : string;
    catEntidadFederativaID : number;
    municipioNacimiento: number; 
    entidadNacimiento: number ;
    entidadFederativa : string;     
    fehaHoraIngreso : Date;
    nombreDetenidoString : string;
    nombreDetenido: Nombre; 
    apellidoPaternoDetenido : string;
    apellidoMaternoDetenido : string;
    observaciones : string;
    nacionalidadID : number;
    nacionalidad : string;
    oficioRetencion : string;
    dependenciaDetencionID : number;
    noProporcionada: boolean ;

    dependenciaDetencion : string;
    otraAutoridadTextBox: string ;
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
    otrosNombres : OtroNombre [];
    fichas: string[];
     // DOMICILIO 
    calle : string;
    numero : string; 
    codigoPostal : string ;
    localidad : number;  
    municipio : number ; 
    entidad : number ; 
    // DATOS DETENIDO 
    isRelevante: boolean ; 
    sexoDetenido : number ;
    edadDetenido :number; 
    rfcDetenido: string ;
    lugarDeNacimiento : string ;

    nacionalidadDetenido : number ;
    senasParticulares  : string ;
    domicilioParticular : Domicilio;
    fechaDeNacimiento: Date;
    fechaHoraIngreso: Date;
    // DATOS DEL FAMILIAR
    nombreFamiliar : string;
    apellidoPaternoFamiliar : string; 
    apellidoMaternoFamiliar: string;
    telefonoFamiliar: string;
    parentescoFamiliar: string ; 
    
    // DATOS DE EGRESO 
    fechaEgreso : Date ; 
    numeroOficioEgreso : string ; 
    motivoEgreso : string ;
    observacionesEgreso : string; 
    
    constructor(detenido : DetenidosDTO){

        this.id = detenido.id;
        this.folioIngreso = detenido.folioIngreso;
        this.anioFolioIngreso = detenido.anioFolioIngreso
        this.numeroOficio = detenido.numeroOficio
        this.folioEstatal = detenido.folioEstatal
        this.sedeSubsedeID = detenido.sedeSubsedeID 
        this.nombreSedeSubsede = detenido.nombreSedeSubsede
        this.nombreSedeSubsedeLargo  = detenido.nombreSedeSubsedeLargo
        this.catEntidadFederativaID  = detenido.catEntidadFederativaID
        this.entidadFederativa = detenido.entidadFederativa
        this.entidadNacimiento = detenido.entidadNacimiento; 
        this.municipioNacimiento = detenido.municipioNacimiento ; 
        // INFORMACION DETENIDO 
        this.fehaHoraIngreso  = detenido.fehaHoraIngreso
        this.nombreDetenido = detenido.nombreDetenido
        this.nombreDetenidoString =detenido.nombreDetenidoString;
        this.apellidoPaternoDetenido = detenido.apellidoPaternoDetenido
        this.apellidoMaternoDetenido  = detenido.apellidoMaternoDetenido
        this.observaciones  = detenido.observaciones
        this.nacionalidadID  = detenido.nacionalidadID
        this.nacionalidad  = detenido.nacionalidad
        this.oficioRetencion  = detenido.oficioRetencion
        this.dependenciaDetencionID  = detenido.dependenciaDetencionID
        this.dependenciaDetencion   = detenido.dependenciaDetencion
        this.noProporcionada = detenido.noProporcionada;
        this.otraAutoridadTextBox = detenido.otraAutoridadTextBox
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
        // DOMICILIO
        this.calle = detenido.calle;
        this.numero = detenido.numero ;
        this.localidad = detenido.localidad ;
        this.codigoPostal = detenido.codigoPostal ;
        this.municipio = detenido.municipio ;
        this.entidad = detenido.entidad ;
        // DATOS DETENIDO 
        this.isRelevante = detenido.isRelevante;
        this.sexoDetenido = detenido.sexoDetenido;
        this.edadDetenido = detenido.edadDetenido;
        this.rfcDetenido = detenido.rfcDetenido;
        this.lugarDeNacimiento = detenido.lugarDeNacimiento;
        this.nacionalidadDetenido = detenido.nacionalidadDetenido;
        this.senasParticulares = detenido.senasParticulares;
        this.domicilioParticular = detenido.domicilioParticular;
        this.fechaDeNacimiento = detenido.fechaDeNacimiento;
        this.fechaHoraIngreso= detenido.fechaHoraIngreso; 
        // DATOS FAMILIAR
        this.nombreFamiliar = detenido.nombreFamiliar;
        this.apellidoPaternoFamiliar = detenido.apellidoPaternoFamiliar;
        this.apellidoMaternoFamiliar = detenido.apellidoMaternoFamiliar;
        this.parentescoFamiliar = detenido.parentescoFamiliar;
        this.telefonoFamiliar = detenido.telefonoFamiliar;
        // DATOS DE EGRESO
        this.fechaEgreso = detenido.fechaEgreso;
        this.numeroOficioEgreso = detenido.numeroOficioEgreso;
        this.motivoEgreso = detenido.motivoEgreso;
        this.observacionesEgreso = detenido.observacionesEgreso;
    } 
}
export class DetenidosDTO_Net{
    id : string;
    folioIngreso : number;
    numeroOficio: string;
    anioFolioIngreso : number;
    sedeSubsedeID : number;
    nombreSedeSubsede : string;
    nombreSedeSubsedeLargo : string;
    catEntidadFederativaID : number;
    entidadNacimiento: number; 
    municipioNacimiento :number; 
    entidadFederativa : string;   
    nombreDetenido : string; 
    apellidoPaternoDetenido : string;
    apellidoMaternoDetenido : string;
    observaciones : string;
    nacionalidadID : number;
    nacionalidad : string;
    oficioRetencion : string;
    dependenciaDetencionID : number;
    dependenciaDetencion : string;
    noProporcionada: boolean;
    otraAutoridadTextBox: string ;
    rutaFirmaHuella : string;
    usuarioID : string;
    fechaAltaDelta : Date;
    fechaActualizacionDelta : Date;
    aliases : Aliases[];
    // DOMICILIO 
    calle : string;
    numero : string; 
    codigoPostal : string ;
    localidad : number ; 
    municipio : number ; 
    entidad : number ; 
    // DATOS DETENIDO 
    isRelevante: boolean ; 
    sexoDetenido : number ;
    edadDetenido :number; 
    rfcDetenido: string ;
    nacionalidadDetenido : number ;
    senasParticulares  : string ;
    domicilioParticular : Domicilio;
    fechaDeNacimiento: Date ; 
    fechaHoraIngreso: Date;
    // DATOS DEL FAMILIAR
    nombreFamiliar : string;
    apellidoPaternoFamiliar : string; 
    apellidoMaternoFamiliar: string;
    telefonoFamiliar: string;
    parentescoFamiliar: string ; 
    // DATOS DE EGRESO 
    fechaEgreso : Date ; 
    numeroOficioEgreso : string ; 
    motivoEgreso : string ;
    observacionesEgreso : string; 
    // DELITOS
    delitos : CatDelitoModalidadPrometheusPFM[];
  // clasificaciones:CatDelitoModalidadPrometheusPFM[];
    catSeparoID : number;
    enviado : boolean;
    otrosNombres : OtroNombre [];

   constructor(detenido : DetenidosDTO){
        this.id = detenido.id;
        this.folioIngreso = detenido.folioIngreso;
        this.numeroOficio = detenido.numeroOficio;
        this.anioFolioIngreso = detenido.anioFolioIngreso
        this.sedeSubsedeID = detenido.sedeSubsedeID 
        this.nombreSedeSubsede = detenido.nombreSedeSubsede
        this.nombreSedeSubsedeLargo  = detenido.nombreSedeSubsedeLargo
        this.catEntidadFederativaID  = detenido.catEntidadFederativaID
        this.entidadNacimiento = detenido.entidadNacimiento; 
        this.municipioNacimiento = detenido.municipioNacimiento ; 
        this.entidadFederativa = detenido.entidadFederativa
        this.fechaHoraIngreso  = detenido.fechaHoraIngreso
        this.nombreDetenido = detenido.nombreDetenidoString
        this.apellidoPaternoDetenido = detenido.apellidoPaternoDetenido
        this.apellidoMaternoDetenido  = detenido.apellidoMaternoDetenido
        this.observaciones  = detenido.observaciones
        this.nacionalidadID  = detenido.nacionalidadID
        this.nacionalidad  = detenido.nacionalidad
        this.oficioRetencion  = detenido.oficioRetencion
        this.dependenciaDetencionID  = detenido.dependenciaDetencionID
        this.dependenciaDetencion   = detenido.dependenciaDetencion
        this.noProporcionada = detenido.noProporcionada; 
        this.otraAutoridadTextBox = detenido.otraAutoridadTextBox;
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
        // DOMICILIO
        this.calle = detenido.calle;
        this.numero = detenido.numero ;
        this.codigoPostal = detenido.codigoPostal ;
        this.localidad = detenido.localidad ;
        this.municipio = detenido.municipio; 
        this.entidad = detenido.entidad ;

        // DATOS DETENIDO 
        this.isRelevante = detenido.isRelevante;
        this.sexoDetenido = detenido.sexoDetenido;
        this.edadDetenido = detenido.edadDetenido;
        this.rfcDetenido = detenido.rfcDetenido;
        this.nacionalidadDetenido = detenido.nacionalidadDetenido;
        this.senasParticulares = detenido.senasParticulares;
        this.domicilioParticular = detenido.domicilioParticular;
        this.nombreFamiliar = detenido.nombreFamiliar; 
        this.fechaDeNacimiento = detenido.fechaDeNacimiento;
        this.fechaHoraIngreso = detenido.fechaHoraIngreso; 
        // FAMILIAR 
        this.nombreFamiliar = detenido.nombreFamiliar;
        this.apellidoPaternoFamiliar = detenido.apellidoPaternoFamiliar;
        this.apellidoMaternoFamiliar = detenido.apellidoMaternoFamiliar;
        this.parentescoFamiliar = detenido.parentescoFamiliar;
        this.telefonoFamiliar = detenido.telefonoFamiliar;
        // DATOS DE EGRESO
        this.fechaEgreso = detenido.fechaEgreso;
        this.numeroOficioEgreso = detenido.numeroOficioEgreso;
        this.motivoEgreso = detenido.motivoEgreso;
        this.observacionesEgreso = detenido.observacionesEgreso;
        //
        this.observaciones = detenido.observaciones; 
   }
}
