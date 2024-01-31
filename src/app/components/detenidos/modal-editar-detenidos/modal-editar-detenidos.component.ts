import { DatePipe, formatDate, getLocaleDateFormat } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { catAutoridadCargoDetencionDTO } from 'src/app/models/catalogos/catAutoridadCargoDetencion';
import { catDelitoDTO } from 'src/app/models/catalogos/catDelito';
import { catMotivoEgreso } from 'src/app/models/catalogos/catMotivoEgreso';
import { catNacionalidadDTO } from 'src/app/models/catalogos/catNacionalidad';
import { Aliases } from 'src/app/models/detenidos/alias';
import { Delito } from 'src/app/models/detenidos/delito';
import { DetenidosDTO, DetenidosDTO_Net, Nombre, OtroNombre, Familiar, Domicilio, Delitos_, Aliases_, Detenido_update } from 'src/app/models/detenidos/detenidos';
import { formEgreso } from 'src/app/models/detenidos/formEgreso';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { formatearFecha, parsearErroresAPI } from 'src/app/utils/utils';
import { catSexo } from 'src/app/models/catalogos/catSexo';
import { catDelitoPFMDTO } from 'src/app/models/catalogos/catDelitoPFM';
import { catDelitoModalidadPrometheusPFMDTO } from 'src/app/models/catalogos/catDelitoModalidadPrometheusPFM';
import { CatDelitoModalidadPrometheusPFM } from 'src/app/models/detenidos/catdelitomodalidadprometheuspfm';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { identifierModuleUrl } from '@angular/compiler';
import { ChangeDetectorRef } from '@angular/core';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    // Lo transforma en un booleano
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'detenciones-modal-editar-detenidos',
  templateUrl: './modal-editar-detenidos.component.html',
  styleUrls: ['./modal-editar-detenidos.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class ModalEditarDetenidosComponent implements OnInit {

  private _gap = 10;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;
  matcher = new MyErrorStateMatcher();

  //parseo para el modelo
  @Input()
  modeloDetenido!: any;
  banderaDelito:boolean = false;

  fechaModeloDetenido : string | undefined;

  // Valores del select
  listaAutoridadCargoDetencion: catAutoridadCargoDetencionDTO[] = [];
  listaNacionalidad : catNacionalidadDTO[]=[];
  listaDelito : catDelitoDTO[]=[];
  listaMotivoEgreso : catMotivoEgreso[]=[];
  listaSexo : catSexo[] = []; 
  listaOtrosNombres : OtroNombre[] = [];
  //Agregado por Gsutavo Diego
  listaDelitoPFM: catDelitoPFMDTO[] = [];
  listaClasificacionDelitoPFM: catDelitoModalidadPrometheusPFMDTO[]=[];

  listaEntidad : any [] = []; 
  listaMunicipioNacimiento : any [] =[]; 
  listaMunicipioDomicilio : any [] =[]; 
  listaColoniaDomicilio : any []= [];
  isCheckboxDisabled : boolean = false ;

    @Input()
    formDetenido!: FormGroup;
    otraAutoridadSelect : boolean = false; 

    @Input()
    formEgreso!: FormGroup;

   //datos de alias en tabla
    dataAlias!: MatTableDataSource<any>;
    //datos de delito en tabla
    dataDelito!: MatTableDataSource<any>;
    //datos de nombre en tabla
    dataOtrosNombres! : MatTableDataSource<any>;

    // Parametro para regla de fecha egreso>fechadetencion
    fechaMinima : string | undefined ;
    horaMinima : string | undefined ;
    fechaEgresoS: string | undefined;

    faltaNombre : boolean = false ;
    faltaApellidoPaterno : boolean = false ;
    faltaApellidoMaterno : boolean = false ;

    //Listas Logicas para Recibir
    @Input()
    public listaAlias : string[]=[];
    @Input()
    public listaDelitos : string[]=[];
    @Input()
    public listaDelitosID : number[]=[];
    //Listas Logicas para mandar
    @Input()
    public listaAliasF : Aliases[]=[];
    @Input()
    public listaDelitosF : Delito[]=[];
    @Input()
    public listaDelitosIDF : Delito[]=[];
    @Input()
    public listaDelitosC : CatDelitoModalidadPrometheusPFM[]=[];
    @Input()
    public listaDelitosCF : CatDelitoModalidadPrometheusPFM[]=[];

    otrosNombresCheckBox : boolean = false; 
    //Declaracion de lista de roles para hacer la validaciones
    roles : string[]=[];

    // Se declara para inhabilitar la edicion en el detenido
    toDisplay = true;

    constructor(
      private formBuilder: FormBuilder,
      private catalogosService: CatalogosService,
      private detenidoServices: DetenidosService,
      public dialog: MatDialog,
      public mensajeService: MensajesService,
      private cdr: ChangeDetectorRef,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public datepipe: DatePipe,
      private seguridadService : SeguridadService,
    ) {
      this.modeloDetenido = { ...data };
    }

    //ESTAS SON PARA LAS TABLAS DE DELITO Y ALIAS CUANDO SE PUEDA EDITAR
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
      this.catalogosService.getCatDelito().subscribe(delito => {
        this.listaDelito = delito.body;
      })
      this.catalogosService.getCatoMotivoEgreso().subscribe(motivoEgreso => {
        this.listaMotivoEgreso = motivoEgreso.body;
      })
      // 
      this.catalogosService.getSexoList().subscribe(sexoList=>{
        this.listaSexo = sexoList.body;
      })
      this.catalogosService.getEntidadFederativaNacimiento().subscribe(listaEntidadNacimiento=>{
        this.listaEntidad = listaEntidadNacimiento.body;
      })
      //
      //Agregado por Gustavo Diego
      this.catalogosService.getCatDelitoPFM().subscribe(delitoPFM => {
        this.listaDelitoPFM = delitoPFM.body;
      })
      this.catalogosService.getCatClasificacionDelitoPFM(0).subscribe(clasifiaciondelitoPFM => {
        this.listaClasificacionDelitoPFM = clasifiaciondelitoPFM.body;
      })
      //Iniciamos con la validacion del formulario del detenido
      
      this.formDetenido = this.formBuilder.group({
         // DATOS DEL OFICIO
        fehaHoraIngreso: ['', Validators.required],
        oficioRetencion:['', [Validators.required,Validators.maxLength(50),this.validacionOficio()]],
        dependenciaDetencionID: ['', [Validators.required]],
        noProporcionada: [false],
        otraAutoridadTextBox:[this.modeloDetenido.dependenciaDetencion],
        delito: [0],
        clasificacion: [0],
        // DATOS DEL DETENIDO
        // nombre detenido
        nombreDetenido: ['',[Validators.required, Validators.maxLength(100)]],
        apellidoPaternoDetenido: ['',[Validators.required, Validators.maxLength(100)]],
        apellidoMaternoDetenido: ['',[Validators.required, Validators.maxLength(100)]],
        isRelevante:[false],
        // OTROS NOMBRES
        otrosNombresCheckBoxForm : [false],
        otroNombreDetenido : ['', [Validators.maxLength(100)]],
        otroApellidoPaternoDetenido : ['', [Validators.maxLength(100)]],
        otroApellidoMaternoDetenido : ['', [Validators.maxLength(100)]], 
        //ALIAS
        alias:[''],
        //NACIONALIDAD
        nacionalidadID: [0, Validators.required],
        // 
        sexoDetenido:[this.modeloDetenido.sexoDetenido,[Validators.required]],
        fechaDeNacimiento:['',[Validators.required]],
        edadDetenido:['',[Validators.required, Validators.max(150), Validators.min(0)]],
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
        // DATOS DEL FAMILIAR
        nombreFamiliar:['',[Validators.maxLength(100)]],
        apellidoPaternoFamiliar:['',[Validators.maxLength(100)]],
        apellidoMaternoFamiliar:['',[Validators.maxLength(100)]],
        parentescoFamiliar:['',[Validators.maxLength(100)]],
        telefonoFamiliar:['', [Validators.maxLength(12),Validators.minLength(10)]],
        // OBSERVACIONES
        observaciones: ['',[Validators.maxLength(500)]],
      });

      this.otraAutoridad (this.modeloDetenido.dependenciaDetencionID)

      if (this.modeloDetenido !== undefined) {
        this.catalogosService.getMunicipioByEntidad(this.modeloDetenido.domicilioParticular.entidadID).subscribe(listaMunicipioDomicilio=>{
          this.listaMunicipioDomicilio = listaMunicipioDomicilio.body;
        })

        this.catalogosService.getMunicipioByEntidad(this.modeloDetenido.entidadNacimientoId).subscribe(listaMunicipioNacimiento=>{
          this.listaMunicipioNacimiento = listaMunicipioNacimiento.body;
        })

        this.catalogosService.getColoniaByIdMunicipio(this.modeloDetenido.domicilioParticular.municipioID).subscribe(listaColonia=>{
          this.listaColoniaDomicilio = listaColonia.body;
        })
        
        this.formDetenido.patchValue(this.modeloDetenido);
        
        this.fechaMinima =   moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('YYYY-MM-DDTHH:mm');
        this.horaMinima = moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('HH:mm');
        let fecha = moment(new Date(this.modeloDetenido.fehaHoraIngreso)).format('YYYY-MM-DDTHH:mm');

        const otrosNombresCheckBox = this.modeloDetenido.otrosNombres.length !== 0 ? true : false ;  
        this.otrosNombresCheckBox = otrosNombresCheckBox;
        this.dataOtrosNombres.data = otrosNombresCheckBox ? this.modeloDetenido.otrosNombres.filter(persona => persona.borrado === false) : [];
        this.listaOtrosNombres =  this.modeloDetenido.otrosNombres;

        this.formDetenido.patchValue({
          fehaHoraIngreso : fecha,
          nombreDetenido: this.modeloDetenido.nombreDetenido.nombre,
          apellidoPaternoDetenido:this.modeloDetenido.nombreDetenido.apellidoPaterno,
          apellidoMaternoDetenido:this.modeloDetenido.nombreDetenido.apellidoMaterno,
          sexoDetenido:1,
          edadDetenido: this.modeloDetenido.edad,
          rfcDetenido : this.modeloDetenido.rfc,
          otrosNombresCheckBoxForm : otrosNombresCheckBox,
          entidadNacimiento:this.modeloDetenido.entidadNacimientoId,
          municipioNacimiento: this.modeloDetenido.municipioNacimientoId, 
          calle: this.modeloDetenido.domicilioParticular.calle,
          numero:this.modeloDetenido.domicilioParticular.numero,
          localidad:this.modeloDetenido.domicilioParticular.localidadID,
          codigoPostal:this.modeloDetenido.domicilioParticular.codigoPostal,
          municipio:this.modeloDetenido.domicilioParticular.municipioID,
          entidad:this.modeloDetenido.domicilioParticular.entidadID,
          fechaDeNacimiento :this.modeloDetenido.fechaNacimiento,
          nombreFamiliar: this.modeloDetenido.familiar.nombreFamiliar.nombre,
          apellidoPaternoFamiliar:this.modeloDetenido.familiar.nombreFamiliar.apellidoPaterno,
          apellidoMaternoFamiliar :this.modeloDetenido.familiar.nombreFamiliar.apellidoMaterno,
          parentescoFamiliar:this.modeloDetenido.familiar.parentesco,
          telefonoFamiliar :this.modeloDetenido.familiar.telefono,
          observaciones: this.modeloDetenido.observacionesDetenido
        })
        this.calcularFecha();
        // this.modeloDetenido.fehaHoraIngreso = stringvalue
        //Para llenar la lista de alias con el modelo que se obtiene
        if(this.modeloDetenido.aliases != null){
          for(let x = 0;x<this.modeloDetenido.aliases.length;x++){
            if(this.modeloDetenido.aliases[x].borrado == 0){
              this.listaAlias.push(this.modeloDetenido.aliases[x].alias);
              this.listaAliasF.push(this.modeloDetenido.aliases[x]);
              this.dataAlias.data = this.listaAlias;

            }
          }
        }

        //Para llenar la lista de delitos con el modelo que se obtiene
        // if(this.modeloDetenido.delitos != null){
        //   for(let x = 0;x<this.modeloDetenido.delitos.length;x++){
        //   this.listaDelitos.push(this.modeloDetenido.delitos[x].clasificacion);
        //   this.listaDelitosC.push(this.modeloDetenido.delitos[x].catClasificaDelitoID);
        //   this.dataDelito.data = this.listaDelitos;
        //   }
        // }

        //Para llenar la lista de delitos con el modelo que se obtiene
        for(let x = 0; x < this.modeloDetenido.delitos.length;x++){
          if(this.modeloDetenido.delitos[x].borrado == 0){
            this.listaDelitos.push(this.modeloDetenido.delitos[x].clasificacion);
            this.listaDelitosID.push(this.modeloDetenido.delitos[x]["catClasificacionDelitoID"]);
            this.listaDelitosC.push(this.modeloDetenido.delitos[x]);
            this.dataDelito.data = this.listaDelitos;
          }
        }
      // console.log(this.listaDelitosID);
      } 
      // this.detenidoServices.modeloEgreso(this.modeloDetenido.id)
      // .subscribe(egreso =>{
      //   console.log(egreso);
      // })
      // formulario para el egreso del detenido
      this.formEgreso = this.formBuilder.group({
        oficioEgreso:['', [Validators.required,Validators.maxLength(50),this.validacionOficio()]],
        fechaHoraEgreso: ['', Validators.required],
        motivoEgresoID: ['', Validators.required],
        observaciones: [''],
      });
      if (this.modeloDetenido.egreso != null) {
        this.formEgreso.patchValue(this.modeloDetenido.egreso[0]);
        let fechaEgreso = moment(new Date(this.modeloDetenido.egreso[0].fechaHoraEgreso)).format('YYYY-MM-DDTHH:mm');
        this.formEgreso.patchValue({
          fechaHoraEgreso : fechaEgreso,
        })
      }
      //Se bloquea cualquier accion para editar cuando el estatus este en visto
      if(this.modeloDetenido.estatusRegistro == "Visto"){
        this.toDisplay = false;
        this.formDetenido.disable();
        //ESTA LINEA ES PARA BLOQUEAR EL REGISTRO DEL EGRESO CUANDO ESTE EN VISTO, SE TIENE QUE DETERMINAR EN QUE ESTATUS DEL DETENIDO SE DEBERA BLOQUEAR
        // this.formEgreso.disable();
        this.columnsDelito[1].visible = false;
        this.columns[1].visible = false;
      }
      this.getRoles();
    }
    //Esta funcion es para que cuando el rol sea de consulta no se pueda editar ningun campo
    getRoles(){
      this.roles = this.seguridadService.getRoles();
      if(this.roles.length > 1){
        for(let x = 0; x<this.roles.length;x++){
        }
      }
      else{
        if( this.roles[0] == "PFM_Consulta"){
          this.toDisplay = false;
          this.formDetenido.disable();
          this.formEgreso.disable();
          this.columnsDelito[1].visible = false;
          this.columns[1].visible = false;
        }
      }
    }
    guardar(detenido : any){
      if(detenido !== undefined){
        //Para guardar variables del form y mandarlo junto con el modelo
        let fehaHoraIngreso = detenido.fehaHoraIngreso;
        let oficioRetencion = detenido.oficioRetencion;
        let dependenciaId = detenido.dependenciaDetencionID;
        let observaciones = detenido.observacionesDetenido;
        let nombreDetenido = detenido.nombreDetenido;
        let apellidoPaternoDetenido = detenido.apellidoPaternoDetenido;
        let apellidoMaternoDetenido = detenido.apellidoMaternoDetenido;
        let nacionalidadId = detenido.nacionalidadID;
        let otroNombre = detenido.otrosNombres;
        let isRelevant = this.formDetenido.value.isRelevante
        //Se mapea con el modelo que se traia desde la consulta
        detenido = this.modeloDetenido;
        //Se asigna con los nuevos parametros que el usuario cambio en el form
        detenido.fehaHoraIngreso = fehaHoraIngreso;
        detenido.oficioRetencion = oficioRetencion
        detenido.dependenciaDetencionID = dependenciaId;
        detenido.observacionesDetenido = observaciones;
        detenido.nombreDetenido = nombreDetenido;
        detenido.apellidoPaternoDetenido = apellidoPaternoDetenido;
        detenido.apellidoMaternoDetenido = apellidoMaternoDetenido;
        detenido.nacionalidadID = nacionalidadId;
        detenido.otrosNombres = otroNombre;
        detenido.aliasesEdit = this.listaAlias;
        //  detenido.delitosEdit = this.listaDelitosID;
        detenido.delitosEdit = this.listaDelitosID;
        const nombreDetenido_ = new Nombre (detenido.nombreDetenido, detenido.apellidoPaternoDetenido, detenido.apellidoMaternoDetenido); 
        const otrosNombres_ = this.listaOtrosNombres;
        const fehcaNacimiento = this.formDetenido.value.fechaDeNacimiento; 
        const senasParticulares = this.formDetenido.value.senasParticulares;
        const RFC = this.formDetenido.value.rfcDetenido;
        const Edad = this.formDetenido.value.edadDetenido; 
        let dependenciaDetencion_ ; 
        const domicilio = new Domicilio(
          this.formDetenido.value.calle,
          this.formDetenido.value.numero,
          this.formDetenido.value.codigoPostal,
          this.formDetenido.value.localidad," ",
          this.formDetenido.value.municipio," ",
          this.formDetenido.value.entidad," "
        )
        const nombreFamiliar = new Nombre(this.formDetenido.value.nombreFamiliar, this.formDetenido.value.apellidoPaternoFamiliar,this.formDetenido.value.apellidoMaternoFamiliar)
        const familiar =  new Familiar (
            nombreFamiliar,
            this.formDetenido.value.parentescoFamiliar,
            this.formDetenido.value.telefonoFamiliar,
          );  
  
        if(detenido.dependenciaDetencionID === 9){
          dependenciaDetencion_ = this.formDetenido.get('otraAutoridadTextBox')?.value;
        }else{
          dependenciaDetencion_ = detenido.dependenciaDetencion; 
        }
        const detenidoEnviar = new Detenido_update(
          detenido.id,
          detenido.folioIngreso, // <- folio ingreso
          detenido.anioFolioIngreso,
          detenido.catSeparoID,
          detenido.sedeSubsedeID,
          detenido.nombreSedeSubsede,
          detenido.nombreSedeSubsedeLargo,
          detenido.catEntidadFederativaID,
          detenido.entidadFederativa,
          fehaHoraIngreso,
          nombreDetenido_,
          otrosNombres_,
          this.formDetenido.value.observaciones,
          detenido.nacionalidadID,
          detenido.nacionalidad,
          familiar, 
          isRelevant,
          detenido.sexo,
          RFC,
          Edad,
          fehcaNacimiento,
          this.formDetenido.value.entidadNacimiento,
		      this.formDetenido.value.municipioNacimiento,
          domicilio,
          senasParticulares,
          detenido.oficioRetencion,
          detenido.dependenciaDetencionID,
          dependenciaDetencion_,
          detenido.rutaFirmaHuella,
          detenido.usuarioID,
          detenido.fechaAltaDelta,
          detenido.fechaActualizacionDelta,
          detenido.aliases,
          detenido.delitos,
          detenido.asignacion,
          detenido.egreso,
          detenido.fichas,
          detenido.estatusRegistro || " ",
          detenido.borrado,
          detenido.aliasesEdit,
          detenido.delitosEdit
        )

        this.detenidoServices.editarDetenido(this.modeloDetenido.id,detenidoEnviar).subscribe((crearDetenido : HttpResponse<DetenidosDTO[]>|any) => {
          if(crearDetenido == true){
            this.mensajeService.MensajeSwal('Registro editado correctamente',  'success');
            this.dialog.closeAll();
          }
        },errores => this.errores = parsearErroresAPI(errores));
      }
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
          alias : '',
        })
      }
      else{
        this.formDetenido.patchValue({
          alias : '',
        })
      }
    }
    //Eliminar item en lista logica de alias
    deleteItemAlias(detenido){
      for(let i=0 ;i<= this.listaAlias.length ;i++){
        if(detenido== this.listaAlias[i]){
          this.listaAlias.splice(i,1);
          this.listaAliasF.splice(i,1)
          // console.log(this.lista);
          this.dataAlias.data = this.listaAlias;
        }
      }
    }
    showHideOtrosNombres(detenido): void {
      this.otrosNombresCheckBox = this.formDetenido.get('otrosNombresCheckBoxForm')?.value ; 
    }
    //Guardar lista logica de delito
    async GuardarListaDelito(detenido){
      let filtroDelitos = this.listaClasificacionDelitoPFM.filter(f => f.catClasificaDelitoID == detenido.clasificacion);
      let delitoEncontrado: CatDelitoModalidadPrometheusPFM = {catClasificaDelitoID: 0} as CatDelitoModalidadPrometheusPFM;
      if(filtroDelitos.length > 0) {
        delitoEncontrado = filtroDelitos[0];
      }

      this.banderaDelito=false;
      // if(detenido.delito != null && detenido.delito  != ""){
      if(delitoEncontrado.catClasificaDelitoID != 0){
        detenido["catdelitomodalidadprometheuspfm"] = delitoEncontrado;
        if(this.listaDelitosID.length == 0){
          this.listaDelitos.push(detenido.catdelitomodalidadprometheuspfm.clasificacion);
          this.listaDelitosID.push(detenido.catdelitomodalidadprometheuspfm.catClasificaDelitoID);
          this.dataDelito.data = this.listaDelitos;
          // console.log(filtroDelitos);
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
    }
    //Eliminar item en lista logica de delito
    deleteItemDelito(detenido){

        for(let i=0 ;i<= this.listaDelitos.length ;i++)
        {
          if(detenido== this.listaDelitos[i])
          {
            this.listaDelitos.splice(i,1);
            this.listaDelitosC.splice(i,1);
            this.listaDelitosID.splice(i,1);
            this.dataDelito.data = this.listaDelitos;
            }

        }

      }
    cancelar() {
      this.dialog.closeAll();

    }
    onNoClick(){
      this.dialog.closeAll();
    }
    resize(){
      let modalRef: MatDialogRef<ModalEditarDetenidosComponent>;
      modalRef=this.dialog.open(ModalEditarDetenidosComponent);
      modalRef.updateSize('400px', '300px').updatePosition();
    }
    guardarEgreso(egreso : formEgreso){
      if(egreso !== undefined){


        this.detenidoServices.insertEgreso(this.modeloDetenido.id,egreso).subscribe(
          (crearEgreso : HttpResponse<formEgreso[]>|any) => {

            if(crearEgreso =! null){
              this.mensajeService.MensajeSwal('Se registro correctamente el egreso del detenido',  'success');

              //Para mapear el modelo del egreso y ya sea para editar
              this.detenidoServices.modeloDetenido(this.modeloDetenido.id)
              .subscribe((modelo : HttpResponse<DetenidosDTO[]> | any) => {
                this.modeloDetenido.egreso = modelo.egreso;
              }
              ,errores => this.errores = parsearErroresAPI(errores));
            }
          },errores => this.errores = parsearErroresAPI(errores));
      }
    }
    editarEgreso(egreso : formEgreso){
      if(egreso !== undefined){


        this.detenidoServices.editEgreso(this.modeloDetenido.id,egreso).subscribe(
          (editarEgreso : HttpResponse<formEgreso[]>|any) => {
            if(editarEgreso == true){
              this.mensajeService.MensajeSwal('Se edito correctamente el egreso del detenido',  'success');
              // this.dialog.closeAll();
            }

          },errores => this.errores = parsearErroresAPI(errores));
      }
    }
    onDateChange() {
      this.fechaMinima =   moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('YYYY-MM-DDTHH:mm');
      this.horaMinima = moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('HH:mm');
      this.formEgreso.patchValue({
        fechaHoraEgreso:''
      })
    }
    onDateChangeEgreso() {
    this.errores=[];
    this.fechaEgresoS = moment(new Date(this.formEgreso.get('fechaHoraEgreso')?.value)).format('HH:mm');

    if (moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('YYYY-MM-DD')==moment(new Date(this.formEgreso.get('fechaHoraEgreso')?.value)).format('YYYY-MM-DD')){

    if(this.horaMinima!=undefined){

      if(this.fechaEgresoS<=this.horaMinima){
        this.errores.push("La hora de egreso no puede ser menor a la hora de ingreso.")
      }
      else {
      }
    }
    }
    else {

    }



    }
    showHideDropdown(value:boolean){
      if(!value){
        this.formDetenido.get('dependenciaDetencionID')?.disable();
        const dependenciaDetencion = this.formDetenido.get('dependenciaDetencionID') as FormControl;
        dependenciaDetencion.setValue(''); 

        const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
        otraAutoridadTextBox?.clearValidators();
        otraAutoridadTextBox?.updateValueAndValidity();
        this.otraAutoridadSelect = false ;
      }else{
        this.formDetenido.get('dependenciaDetencionID')?.enable();      
        this.formDetenido.get('otraAutoridadTextBox')?.enable();
        const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox') as FormControl;
        otraAutoridadTextBox.setValue('');
        const otraAutoridadTextBox_ = this.formDetenido.get('otraAutoridadTextBox');
        otraAutoridadTextBox_?.setValidators([Validators.required, Validators.maxLength(200)]);
        otraAutoridadTextBox?.updateValueAndValidity();
      }
    }
    otraAutoridad(event){
      if(event === 9 ){
        this.otraAutoridadSelect = true;
        const otraAutoridadTextBox = this.formDetenido.get('otraAutoridadTextBox');
        otraAutoridadTextBox?.setValidators([Validators.required, Validators.maxLength(200)]);
        otraAutoridadTextBox?.updateValueAndValidity();
      }
      else if(event == 0){
        const noProporcionada = this.formDetenido.get('noProporcionada') as FormControl;
        noProporcionada.setValue(true);
        this.formDetenido.get('dependenciaDetencionID')?.disable();   
      }
      else{
        this.otraAutoridadSelect = false;
        const dependenciaDetencionControl = this.formDetenido.get('otraAutoridadTextBox') as FormControl;
        dependenciaDetencionControl.setValue('');
        dependenciaDetencionControl.clearValidators();
        dependenciaDetencionControl.updateValueAndValidity();
      }
    }
    //dependientes Delitos
    onChangeClasificaDelito(delitoID:number){
      this.catalogosService.getCatClasificacionDelitoPFM(delitoID).subscribe(clasificaciondelito =>{
        this.listaClasificacionDelitoPFM = clasificaciondelito.body
      })
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
    deleteItemOtrosNombres(item : OtroNombre){
      for(let i=0 ;i<= this.listaOtrosNombres.length ;i++){
        if(item== this.listaOtrosNombres[i]){
          this.listaOtrosNombres[i].borrado = true;
          this.dataOtrosNombres.data = this.listaOtrosNombres.filter(persona => persona.borrado === false)
          }   
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
  
      console.log(validatorName)
      
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



