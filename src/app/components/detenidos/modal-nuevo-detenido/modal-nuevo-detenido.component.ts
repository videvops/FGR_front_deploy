import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { collapseAnimation } from 'angular-calendar';
import { type } from 'jquery';
import { forEach } from 'lodash-es';
import { empty } from 'rxjs';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { catAutoridadCargoDetencionDTO } from 'src/app/models/catalogos/catAutoridadCargoDetencion';
import { catDelitoDTO } from 'src/app/models/catalogos/catDelito';
import { catEntidadFederativaDTO } from 'src/app/models/catalogos/catEntidadFederativa';
import { catNacionalidadDTO } from 'src/app/models/catalogos/catNacionalidad';
import { catSedeSeparoDTO } from 'src/app/models/catalogos/catSedeSeparo';
import { catSeparoDTO } from 'src/app/models/catalogos/catSeparo';
import { Aliases } from 'src/app/models/detenidos/alias';
//import { Delito } from 'src/app/models/detenidos/delito';
import { Detenidos, DetenidosDTO, DetenidosDTO_Net, Domicilio, Nombre, Detenido_Save, Familiar, OtroNombre } from 'src/app/models/detenidos/detenidos';

import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { parsearErroresAPI } from 'src/app/utils/utils';
//Agregado por Gustavo Diego
import { catDelitoPFMDTO } from 'src/app/models/catalogos/catDelitoPFM';
import { catDelitoModalidadPrometheusPFMDTO } from 'src/app/models/catalogos/catDelitoModalidadPrometheusPFM';

import { CatDelitoModalidadPrometheusPFM } from 'src/app/models/detenidos/catdelitomodalidadprometheuspfm';
import { deepStrictEqual } from 'assert';
import { catSexo } from 'src/app/models/catalogos/catSexo';
import { TodoItemNode } from '../../sistema/separo/modal-sepraro/modal-separo/nodo';
import { identifierModuleUrl } from '@angular/compiler';
import { ChangeDetectorRef } from '@angular/core';

interface formEntidadDTO {
  entidadFederativa: number;
  nombreSedeSubsede: number;
  nombreSeparo: number;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    // Lo transforma en un booleano
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'detenciones-modal-nuevo-detenido',
  templateUrl: './modal-nuevo-detenido.component.html',
  styleUrls: ['./modal-nuevo-detenido.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class ModalNuevoDetenidoComponent  {
  

  private _gap = 10;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`; 
  matcher = new MyErrorStateMatcher();

    // Valores del select 
    listaAutoridadCargoDetencion: catAutoridadCargoDetencionDTO[] = [];
    listaNacionalidad : catNacionalidadDTO[]=[];
    listaDelito : catDelitoModalidadPrometheusPFMDTO[]=[]; 
    listaEntidadFederativa : catEntidadFederativaDTO[]=[];
    listaSede : catSedeSeparoDTO[]=[];
    listaSeparo : catSeparoDTO []=[];
    listaSexo : catSexo[] = [];  
    listaEntidad : any [] = []; 
    listaMunicipioNacimiento : any [] =[]; 
    listaMunicipioDomicilio : any [] =[]; 
    listaColoniaDomicilio : any [] = []; 
    listaOtrosNombres : OtroNombre[] = [];

    formEntidad : formEntidadDTO[]=[];

    sedeSubsedeID! : number;
    separoID! : number;

    entidadNombre! : string;
    sedeNombre! : string;
    separoNombre! : string;
    // 
    faltaNombre : boolean = false ;
    faltaApellidoPaterno : boolean = false ;
    faltaApellidoMaterno : boolean = false ;

    //Agregado por Gsutavo Diego
    listaDelitoPFM: catDelitoPFMDTO[] = [];
    listaClasificacionDelitoPFM: catDelitoModalidadPrometheusPFMDTO[]=[];
  // @Input()
  // formEntidadSede!: FormGroup; 

  @Input()
  formDetenido!: FormGroup; 
 //datos de alias en tabla
  dataAlias!: MatTableDataSource<any>;
  //datos de delito en tabla
  dataDelito!: MatTableDataSource<any>;
  //datos de otros nombres en tabla
  dataOtrosNombres!: MatTableDataSource<any>;
  banderaDelito:boolean = false;
  otrosNombresCheckBox : boolean = false; 
  isCheckboxDisabled : boolean = true ;
  otraAutoridadSelect : boolean = false; 
  noProporcionadoDropDown : boolean = false; 


  //Listas Logicas
  @Input()
  public listaAlias : Aliases[]=[];
  @Input()
  public listaDelitos : CatDelitoModalidadPrometheusPFM[]=[];
  @Input()
  public listaDelitosID : CatDelitoModalidadPrometheusPFM[]=[];

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private formBuilder: FormBuilder, 
    private catalogosService: CatalogosService, 
    private detenidoServices: DetenidosService, 
    public dialog: MatDialog, 
    public mensajeService: MensajesService,
    private seguridadService : SeguridadService,
    private cdr: ChangeDetectorRef

  ) { }

  //tabla de alias
  @Input()
  columns: ListColumn[] = [
    { name: 'alias', property: 'alias', visible: true,  isModelProperty: true },
    { name: 'eliminar', property: 'eliminar', visible: true, isModelProperty: true },
   
    ] as ListColumn[];

    get visibleColumns() {
      return this.columns.filter(column => column.visible).map(column => column.property);
    }

    //tabla de delitos
  @Input()
  columnsDelito: ListColumn[] = [
    { name: 'clasificacion', property: 'clasificacion', visible: true,  isModelProperty: true },
    { name: 'eliminar', property: 'eliminar', visible: true, isModelProperty: true },
    ] as ListColumn[];
  get visibleColumnsDelito() {
    return this.columnsDelito.filter(column => column.visible).map(column => column.property);
  }

  //tabla de otros nombres
  @Input()
  columnsOtrosNombres: ListColumn[] = [
    { name: 'nombre', property: 'nombre', visible: true,  isModelProperty: true },
    { name: 'apellidoPaternoOtros', property: 'apellidoPaternoOtros', visible: true, isModelProperty: true },
    { name: 'apellidoMaternoOtros', property: 'apellidoMaternoOtros', visible: true, isModelProperty: true },
    { name: 'eliminar', property: 'eliminar', visible: true, isModelProperty: true },
    ] as ListColumn[];

  get visibleColumnsOtrosNombres() {
    return this.columnsOtrosNombres.filter(column => column.visible).map(column => column.property);
  }
    //Para mostrar los errores
  errores: string[] = [];
  ngOnInit(): void {
     //Iniciamos con la validacion del formulario detenido con mas de una sede
    this.formDetenido = this.formBuilder.group({
      // DATOS DEL OFICIO
      fechaHoraIngreso: ['', Validators.required],
      numeroOficio:['', [Validators.required,Validators.maxLength(50),this.validacionOficio()]],
      dependenciaDetencion: ['',[ Validators.required]],
      noProporcionada:[false],
      otraAutoridadTextBox:[''],
      delito: [0],
      clasificacion: [0],
      // DATOS DEL DETENIDO
        // nombre detenido
      nombreDetenido: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoPaternoDetenido: ['', [Validators.required, Validators.maxLength(100)]],
      apellidoMaternoDetenido: ['', [Validators.required, Validators.maxLength(100)]],
      isRelevante:[false],
      // OTROS NOMBRES
      otrosNombresCheckBoxForm : [false],
      otroNombreDetenido : ['', [Validators.maxLength(100)]],
      otroApellidoPaternoDetenido : ['', [Validators.maxLength(100)]],
      otroApellidoMaternoDetenido : ['', [Validators.maxLength(100)]],
      //ALIAS
      alias:[''],
      //NACIONALIDAD
      nacionalidadDetenido: [0, [Validators.required]], 
      sexoDetenido:[0,[Validators.required]], // 
      fechaDeNacimiento:['',[Validators.required]],
      edadDetenido:['', [Validators.required, Validators.max(150), Validators.min(0)]],
      EdadFechaNacimiento: [{value: 0 , disabled: true}],
      rfcDetenido:['',[Validators.required,Validators.maxLength(13), Validators.minLength(13), this.validacionRfc() ]],
      entidadNacimiento:[0,[Validators.required]],
      municipioNacimiento: [0,[Validators.required]],
      // DOMICILIO PARTICULAR
      calle:['',[Validators.maxLength(150)]],
      numero:['',[Validators.maxLength(20)]],
      codigoPostal:['',[Validators.maxLength(5)]],
      entidad:[0],
      municipio:[0],
      localidad:[0],
      //  DATOS DEL FAMILIAR
      nombreFamiliar:['', [Validators.maxLength(100)]],
      apellidoPaternoFamiliar:['', [Validators.maxLength(100)]],
      apellidoMaternoFamiliar:['', [Validators.maxLength(100)]],
      parentescoFamiliar:['', [Validators.maxLength(100)]],
      telefonoFamiliar:['', [Validators.maxLength(12),Validators.minLength(10)]],
      // OBSERVACIONES
      observaciones: ['',[Validators.maxLength(500)]]
    });

    // ?????
    this.detenidoServices.modeloEntidadSedeSeparo(this.seguridadService.getUserId().toString()).subscribe(modelo =>{
      for(let x = 0; modelo.body.length > x ; x++){
        this.listaEntidadFederativa.push(modelo.body[x]);
        if(x==0){
          this.entidadNombre = modelo.body[x].entidadFederativa;
          this.formDetenido.patchValue({
            entidadFederativa:  modelo.body[x].catEntidadFederativaID
          })
          this.listaSede.push(modelo.body[x].sedes[x])
          this.sedeNombre = modelo.body[x].sedes[x].nombreSedeSubsede;
          this.formDetenido.patchValue({
            nombreSedeSubsede: modelo.body[x].sedes[x].sedeSubsedeID
          })
          this.catalogosService.getCatSeparo(modelo.body[x].sedes[x].sedeSubsedeID).subscribe(separo=> {
            this.listaSeparo = separo.body;
            this.separoNombre = separo.body[0].nombreSeparo;
            this.formDetenido.patchValue({
              nombreSeparo: separo.body[0].catSeparoID
            })})
        }
      }
    })
    this.dataAlias = new MatTableDataSource<any>();
    this.dataDelito = new MatTableDataSource<any>();
    this.dataOtrosNombres = new MatTableDataSource<any>();
    //Se llena los select con el servicio
    this.catalogosService.getCatAutoridadCargoDetencion().subscribe(autoridadCargoDetencion => {
      this.listaAutoridadCargoDetencion = autoridadCargoDetencion.body;
    });
    this.catalogosService.getCatNacionalidad().subscribe(nacionalidad =>{
      this.listaNacionalidad = nacionalidad.body;
    })
    // Catalogo de sexo 
    this.catalogosService.getSexoList().subscribe(sexoList=>{
      this.listaSexo = sexoList.body;
    })
    // Entidad de nacimiento
    this.catalogosService.getEntidadFederativaNacimiento().subscribe(listaEntidadNacimiento=>{
      this.listaEntidad = listaEntidadNacimiento.body;
    })
    // this.catalogosService.getCatDelito()
    // .subscribe(delito => {
    //   this.listaDelito = delito.body;
    // })
  //Agregado por Gustavo Diego
    this.catalogosService.getCatDelitoPFM().subscribe(delitoPFM => {
      this.listaDelitoPFM = delitoPFM.body;
    })
    //  this.catalogosService.getCatClasificacionDelitoPFM(0)
    //  .subscribe(clasifiaciondelitoPFM => {
    //    this.listaClasificacionDelitoPFM = clasifiaciondelitoPFM.body;
    //  })


        //   this.catalogosService.getCatEntidadFederativa()
        // .subscribe(entidadFederativa =>{
        //   this.listaEntidadFederativa = entidadFederativa.body;
        // })
    //     this.detenidoServices.getCatEntidadFederativaUser()
    //     .subscribe(entidadFederativa =>{
    //       this.listaEntidadFederativa = entidadFederativa.body;
    //       console.log(this.listaEntidadFederativa)
    // //no encuentra el id
    //       if(this.listaEntidadFederativa.length == 1 ){
    //         this.entidadFederativaID = this.listaEntidadFederativa[0].catEntidadFederativaID;
    //         this.catalogosService.getSedeSubsede(this.listaEntidadFederativa[0].catEntidadFederativaID)
    //         .subscribe(sede =>{
    //           this.listaSede = sede.body
    //           if( this.listaSede.length == 1){
    //             this.sedeSubsedeID =  this.listaSede[0].sedeSubsedeID;
    //             this.catalogosService.getCatSeparo( this.listaSede[0].sedeSubsedeID)
    //             .subscribe(separo=> {
    //               this.listaSeparo = separo.body;
    //               this.separoID = this.listaSeparo[0].catSeparoID;
                
    //             })
              
    //           }
          
    //         })
          
    //       }
    //     })
      



    //Iniciamos el form de entidad y sede por usuario
    // this.formEntidadSede = this.formBuilder.group({
    //   entidadFederativa:['',Validators.required],
    //   nombreSedeSubsede:['',Validators.required],
    //   nombreSeparo:['',Validators.required],
    // })

    // this.formEntidadSede = this.formBuilder.group({
    //   entidadFederativa:[''],
    //   nombreSedeSubsede:[''],
    //   nombreSeparo:[''],
    // })
    }
  async guardar(detenido : DetenidosDTO_Net){

      const nombreDetenidoObj = new Nombre(detenido.nombreDetenido, detenido.apellidoPaternoDetenido, detenido.apellidoMaternoDetenido)
      const domicilioDetenidoObj = new Domicilio(detenido.calle, detenido.numero, detenido.codigoPostal, detenido.localidad,"", detenido.municipio, "", detenido.entidad, ""); 
      const otrosNombresObj = this.listaOtrosNombres ;
      const nombreFamiliarObj = new Nombre(detenido.nombreFamiliar, detenido.apellidoPaternoFamiliar, detenido.apellidoMaternoFamiliar); 
      const familiarObj = new Familiar(nombreFamiliarObj, detenido.parentescoFamiliar, detenido.telefonoFamiliar); 
      const detenidoSave = new Detenido_Save (nombreDetenidoObj,otrosNombresObj,domicilioDetenidoObj,familiarObj, detenido ); 
      if(detenido !== undefined){
        detenidoSave.Aliases = this.listaAlias;
        detenidoSave.Delitos = this.listaDelitosID;
        detenidoSave.CatSeparoID = 1 //this.formDetenido.get('nombreSeparo')?.value ==="" ? 0 : parseInt(this.formDetenido.get('nombreSeparo')?.value,10) ;
        this.detenidoServices.insertDetenido(detenidoSave).subscribe(
          (detenidoCrear : HttpResponse<Detenidos[]>|any) => {
            if(detenidoCrear != null){
              this.listaAlias = [];
              // this.listaDelitos = [];
              this.formDetenido.patchValue({
                fechaHoraIngreso: '',
                numeroOficio:'',
                dependenciaDetencion:'',
                noProporcionada:[false],
                otraAutoridadTextBox:[''],
                delito: [0],
                clasificacion: [0],
                // DATOS DEL DETENIDO
                  // nombre detenido
                nombreDetenido: '',
                apellidoPaternoDetenido: '',
                apellidoMaternoDetenido: '',
                isRelevante:[false],
                // OTROS NOMBRES
                otrosNombresCheckBoxForm : [false],
                otroNombreDetenido : [''],
                otroApellidoPaternoDetenido : [''],
                otroApellidoMaternoDetenido : [''],
                //ALIAS
                alias:[''],
                //NACIONALIDAD
                nacionalidadDetenido: '',
                sexoDetenido:0,
                fechaDeNacimiento:'',
                edadDetenido:'',
                EdadFechaNacimiento:'',
                rfcDetenido:'',
                entidadNacimiento:'',
                municipioNacimiento: '',
                // DOMICILIO PARTICULAR
                calle:'',
                numero: '',
                codigoPostal:'',
                entidad:0,
                municipio:0,
                localidad:0,
                //  DATOS DEL FAMILIAR
                nombreFamiliar:'',
                apellidoPaternoFamiliar:'',
                apellidoMaternoFamiliar:'',
                parentescoFamiliar:'',
                telefonoFamiliar:'',
                // OBSERVACIONES
                observaciones: '',
                nombreSeparo: this.formDetenido.get('nombreSeparo')?.value,
                otrosNombres:'',
              })
                this.mensajeService.MensajeSwal('Registro correcto con Folio Nacional: '+ detenidoCrear.folioIngreso + ', Folio Estatal: '+ detenidoCrear.folioEstatal,  'success');
                this.listaOtrosNombres = [];
                this.listaAlias = [];
                this.listaDelitos = [];
                this.dialog.closeAll();
            }
          },errores => this.errores = parsearErroresAPI(errores));
      }
  }
  
  showHideOtrosNombres(detenido): void {
    this.otrosNombresCheckBox = !this.formDetenido.get('otrosNombresCheckBoxForm')?.value ; 
  }

//Validacion de numero de oficio
  validacionOficio(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let valor = (<string>control.value);
      let valoresNoAceptables = [".","_"," ",",",";",":"];
      let error = false;
      //Se utiliza some para que el codigo se detenga al momento de encontrar un valor true y pasar a la siguiente validacion
      valoresNoAceptables.some(caracter => {
        error = valor.includes(caracter);
        return error;
      });
      // si es true que mande el error si no que cheque si hay espacios en blanco
      return error || /\s/.test(valor) ? {oficioError: {value: control.value}} : null;
    };
  }

  validacionRfc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rfc = control.value as string;
      // Expresión regular para validar un RFC de persona física en México
      const rfcRegex = /^[A-Za-z]{4}\d{6}[A-Za-z0-9]{3}$/;
      if (!rfcRegex.test(rfc)) {
        return { rfcInvalido: { value: control.value } };
      }
      return null;
    };
  }
  //Guardar lista logica de alias
  async GuardarListaAlias(detenido){
    detenido.alias = detenido.alias.replace(/\s+/g, " ").trim();
    if(detenido.alias  != "" ){
      this.listaAlias.push(detenido.alias);
      this.dataAlias.data = this.listaAlias;
      detenido = null;
      this.formDetenido.patchValue({
        alias : '',})
    }else{
      this.formDetenido.patchValue({
        alias : '',})
    }
  }
  //Eliminar item en lista logica de alias
  deleteItemAlias(detenido){ 
    for(let i=0 ;i<= this.listaAlias.length ;i++){
      if(detenido== this.listaAlias[i]){
        this.listaAlias.splice(i,1)  
        this.dataAlias.data = this.listaAlias;
      }   
    }  
  }
  //Guardar lista logica de delito
  async GuardarListaDelito(detenido){
    let filtroDelitos = this.listaClasificacionDelitoPFM.filter(f => f.catClasificaDelitoID == detenido.clasificacion);
    let delitoEncontrado: CatDelitoModalidadPrometheusPFM = {catClasificaDelitoID: 0} as CatDelitoModalidadPrometheusPFM;
    if(filtroDelitos.length > 0) {
      delitoEncontrado = filtroDelitos[0];
    }
    this.banderaDelito=false;
    if(delitoEncontrado.catClasificaDelitoID != 0){
      detenido["catdelitomodalidadprometheuspfm"] = delitoEncontrado;
      //if(detenido.clasificacion != null && detenido.clasificacion  != ""){
      if(this.listaDelitosID.length == 0){
        this.listaDelitos.push(detenido.catdelitomodalidadprometheuspfm.clasificacion);
        this.listaDelitosID.push(detenido.catdelitomodalidadprometheuspfm.catClasificaDelitoID);
        this.dataDelito.data = this.listaDelitos;
  
        this.formDetenido.patchValue({
          clasificacion : '',
        })
      }
      else{

      for(let x=0;x<this.listaDelitosID.length;x++){
        if(this.listaDelitosID[x]==detenido.catdelitomodalidadprometheuspfm.catClasificaDelitoID){
            this.banderaDelito = true;
        } 
      }
      
      if(this.banderaDelito == false){
            this.listaDelitos.push(detenido.catdelitomodalidadprometheuspfm.clasificacion);
          this.listaDelitosID.push(detenido.catdelitomodalidadprometheuspfm.catClasificaDelitoID);
          this.dataDelito.data = this.listaDelitos;
          this.formDetenido.patchValue({
            clasificacion : '',
          })
          this.banderaDelito = false;
        }
    }
      
    
    }
    else{
    
    }
    
  }
  //Eliminar item en lista logica de delito
  deleteItemDelito(detenido){ 
    // console.log(autor); 
     for(let i=0 ;i<= this.listaDelitos.length ;i++)
     {
        if(detenido== this.listaDelitos[i])
        {
          this.listaDelitos.splice(i,1);
          // this.listaDelitosF.splice(i,1);  
         this.listaDelitosID.splice(i,1);
          this.dataDelito.data = this.listaDelitos;
         }   
    
      }  
  }
  // Guardar lista logica de otros nombres
  GuardarListaOtrosNombres(){

    this.faltaNombre = false
    this.faltaApellidoPaterno = false
    this.faltaApellidoMaterno = false

    const nombre = this.quitarEspaciosDobles(this.formDetenido.get('otroNombreDetenido')?.value);
    const apellidoPaterno = this.quitarEspaciosDobles(this.formDetenido.get('otroApellidoPaternoDetenido')?.value)
    const apellidoMaterno = this.quitarEspaciosDobles(this.formDetenido.get('otroApellidoMaternoDetenido')?.value)

    if(nombre === "" && apellidoPaterno === "" && apellidoMaterno === "") return

    console.log(this.faltaApellidoMaterno)

    if (nombre === "")
      this.faltaNombre = true
    else 
      this.faltaNombre = false

    if( apellidoPaterno === "")
      this.faltaApellidoPaterno = true
    else
      this.faltaApellidoPaterno = false
      
    if(apellidoMaterno === "")
      this.faltaApellidoMaterno = true
    else
    this.faltaApellidoMaterno = false

    if(nombre === "" || apellidoPaterno === "" || apellidoMaterno === "") return

    const otroNombre = new OtroNombre (nombre, apellidoPaterno, apellidoMaterno); 
    this.listaOtrosNombres.push(otroNombre); 
    this.dataOtrosNombres.data = this.listaOtrosNombres;
    this.formDetenido.patchValue({
      otroNombreDetenido : '',
      otroApellidoPaternoDetenido : '',
      otroApellidoMaternoDetenido : '',
    })
  }


  //Eliminar item en lista logica de otros nombres
  deleteItemOtrosNombres(item){
    for(let i=0 ;i<= this.listaOtrosNombres.length ;i++){
       if(item== this.listaOtrosNombres[i]){
         this.listaOtrosNombres.splice(i,1);
         this.dataOtrosNombres.data = this.listaOtrosNombres;
        }   
    } 
  }
  otraAutoridad(event){
    if(event === 9 ){
      this.otraAutoridadSelect = true;
      const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
      otraAutoridadTextBox?.setValidators([Validators.required, Validators.maxLength(200)]);
      this.cdr.detectChanges();
    }else{
      const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
      otraAutoridadTextBox?.clearValidators();
      const dependenciaDetencionControl = this.formDetenido.get('otraAutoridadTextBox') as FormControl;
      dependenciaDetencionControl.setValue('');
      this.otraAutoridadSelect = false;
    }
  }
  cancelar() {
    this.dialog.closeAll();
  }
  onNoClick(){
    this.dialog.closeAll(); 
  }
  onChangeEntidadFederativa(entidad:number){
    this.catalogosService.getSedeSubsede(entidad)
    .subscribe(sede =>{
      this.listaSede = sede.body
      this.listaSeparo = [];
      this.formDetenido.patchValue({
        nombreSeparo: '',
      })
    })
  }
  onChangeSede(sede : number){
    this.catalogosService.getCatSeparo(sede)
    .subscribe(separo=> {
      this.listaSeparo = separo.body;
    
    })
  }
  //dependientes Delitos
  onChangeClasificaDelito(delitoID:number){
    this.catalogosService.getCatClasificacionDelitoPFM(delitoID)
    .subscribe(clasificaciondelito =>{
      this.listaClasificacionDelitoPFM = clasificaciondelito.body
    })
  }
  showHideDropdown(value:boolean){
    if(!value){
      this.formDetenido.get('dependenciaDetencion')?.disable();
      const dependenciaDetencion = this.formDetenido.get('dependenciaDetencion') as FormControl;
      dependenciaDetencion.setValue(''); 

      const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
      otraAutoridadTextBox?.clearValidators();
      this.otraAutoridadSelect = false ;
    }else{
      this.formDetenido.get('dependenciaDetencion')?.enable();      
      this.formDetenido.get('otraAutoridadTextBox')?.enable();
      const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
      otraAutoridadTextBox?.setValidators([Validators.required, Validators.maxLength(200)]);
    }
  }
  calcularFecha() {
    const fecha = this.formDetenido.get('fechaDeNacimiento')?.value;
    if(fecha) {
      const fechaNacimientoDate = new Date(fecha);
      const fechaActual = new Date();
      const diferenciaMilisegundos = fechaActual.getTime() - fechaNacimientoDate.getTime();
      const edad = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25));
      const edadDetenidoFechaNacimiento = this.formDetenido.get('EdadFechaNacimiento') as FormControl;
      edadDetenidoFechaNacimiento.setValue(edad);
    }
  }
  getMunicipioByEntidadSelected(id :number){
    this.catalogosService.getMunicipioByEntidad(id).subscribe(listaMunicipioNacimiento=>{
      this.listaMunicipioNacimiento = listaMunicipioNacimiento.body;
    })
  } 

  getMunicipioByEntidadSelectedDomicilio(id :number){
    this.catalogosService.getMunicipioByEntidad(id).subscribe(listaMunicipioDomicilio=>{
      this.listaMunicipioDomicilio = listaMunicipioDomicilio.body;
    })
  } 

  getColoniaByMunicipioSelectedDomicilio(id: number){
    this.catalogosService.getColoniaByIdMunicipio(id).subscribe(listaColonia=>{
      this.listaColoniaDomicilio = listaColonia.body;
    })
  }

  validateNombre(){
    const nombre  = this.quitarEspaciosDobles(this.formDetenido.get('nombreDetenido')?.value)
    const apellidpP = this.quitarEspaciosDobles(this.formDetenido.get('apellidoPaternoDetenido')?.value)
    const apellidoM = this.quitarEspaciosDobles(this.formDetenido.get('apellidoMaternoDetenido')?.value)

    const validatorName = this.formDetenido.get('nombreDetenido')?.invalid; 
    const validatorAp =  this.formDetenido.get('apellidoPaternoDetenido')?.invalid; 
    const validatorAm = this.formDetenido.get('apellidoMaternoDetenido')?.invalid; 
    
    if( nombre ==="" || apellidpP==="" || apellidoM==="" ||
      validatorName || validatorAp || validatorAm
    ){
      this.isCheckboxDisabled = true
      this.listaOtrosNombres = []
    }
    else{
      this.isCheckboxDisabled = false
    }
  }
  
  quitarEspaciosDobles(cadena: string): string {
    // Utiliza una expresión regular para eliminar espacios duplicados
    const cadenaSinEspaciosDobles = cadena.replace(/\s+/g, ' ');
    // Utiliza trim() para eliminar espacios al inicio y al final
    return cadenaSinEspaciosDobles.trim();
  }
  validateNumbers(event: KeyboardEvent): void {
    // Obtén la tecla presionada
    const key = event.key;

    // Permite solo números (0-9)
    if (isNaN(Number(key))) {
      event.preventDefault(); // Detiene la propagación del evento si no es un número
    }
  }
}

