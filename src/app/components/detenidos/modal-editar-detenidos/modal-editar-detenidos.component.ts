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
import { DetenidosDTO, DetenidosDTO_Net } from 'src/app/models/detenidos/detenidos';
import { formEgreso } from 'src/app/models/detenidos/formEgreso';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { formatearFecha, parsearErroresAPI } from 'src/app/utils/utils';

import { catDelitoPFMDTO } from 'src/app/models/catalogos/catDelitoPFM';
import { catDelitoModalidadPrometheusPFMDTO } from 'src/app/models/catalogos/catDelitoModalidadPrometheusPFM';
import { CatDelitoModalidadPrometheusPFM } from 'src/app/models/detenidos/catdelitomodalidadprometheuspfm';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';



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
   modeloDetenido!: DetenidosDTO;
   banderaDelito:boolean = false;

     fechaModeloDetenido : string | undefined;

      // Valores del select
      listaAutoridadCargoDetencion: catAutoridadCargoDetencionDTO[] = [];
      listaNacionalidad : catNacionalidadDTO[]=[];
      listaDelito : catDelitoDTO[]=[];
      listaMotivoEgreso : catMotivoEgreso[]=[];

        //Agregado por Gsutavo Diego
    listaDelitoPFM: catDelitoPFMDTO[] = [];
    listaClasificacionDelitoPFM: catDelitoModalidadPrometheusPFMDTO[]=[];

    @Input()
    formDetenido!: FormGroup;

    @Input()
    formEgreso!: FormGroup;

   //datos de alias en tabla
    dataAlias!: MatTableDataSource<any>;
    //datos de delito en tabla
    dataDelito!: MatTableDataSource<any>;

    // Parametro para regla de fecha egreso>fechadetencion
    fechaMinima : string | undefined ;
    horaMinima : string | undefined ;
    fechaEgresoS: string | undefined;

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
      @Optional() @Inject(MAT_DIALOG_DATA) public data: DetenidosDTO,
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

      //Para mostrar los errores
      errores: string[] = [];


    ngOnInit(): void {

      this.dataAlias = new MatTableDataSource<any>();
      this.dataDelito = new MatTableDataSource<any>();




      //Se llena los select con el servicio
      this.catalogosService.getCatAutoridadCargoDetencion()
      .subscribe(autoridadCargoDetencion => {
        this.listaAutoridadCargoDetencion = autoridadCargoDetencion.body;
      });

      this.catalogosService.getCatNacionalidad()
      .subscribe(nacionalidad =>{
        this.listaNacionalidad = nacionalidad.body;
      })

      this.catalogosService.getCatDelito()
      .subscribe(delito => {
        this.listaDelito = delito.body;
      })

      this.catalogosService.getCatoMotivoEgreso()
      .subscribe(motivoEgreso => {
        this.listaMotivoEgreso = motivoEgreso.body;
      })

   //Agregado por Gustavo Diego
 this.catalogosService.getCatDelitoPFM()
 .subscribe(delitoPFM => {
   this.listaDelitoPFM = delitoPFM.body;
 })
 this.catalogosService.getCatClasificacionDelitoPFM(0)
 .subscribe(clasifiaciondelitoPFM => {
   this.listaClasificacionDelitoPFM = clasifiaciondelitoPFM.body;
 })



   //Iniciamos con la validacion del formulario del detenido
   this.formDetenido = this.formBuilder.group({

    fehaHoraIngreso: ['', Validators.required],
    nombreDetenido: ['', Validators.required],
    apellidoPaternoDetenido: ['', Validators.required],
    apellidoMaternoDetenido: ['', Validators.required],
    nacionalidadID: [110, Validators.required],
    oficioRetencion:['', [Validators.required,Validators.maxLength(50),this.validacionOficio()]],
    dependenciaDetencionID: ['', Validators.required],
    delito: [''],
    clasificacion: [''],
    observaciones: [''],
    alias:[''],
    otrosNombres:[''],



  });

  if (this.modeloDetenido !== undefined) {
    this.formDetenido.patchValue(this.modeloDetenido);
    this.fechaMinima =   moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('YYYY-MM-DDTHH:mm');
    this.horaMinima = moment(new Date(this.formDetenido.get('fehaHoraIngreso')?.value)).format('HH:mm');


    let fecha = moment(new Date(this.modeloDetenido.fehaHoraIngreso)).format('YYYY-MM-DDTHH:mm');
    this.formDetenido.patchValue({
      fehaHoraIngreso : fecha,
    })

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

     guardar(detenido : DetenidosDTO){
      if(detenido !== undefined){
        //Para guardar variables del form y mandarlo junto con el modelo
        let fehaHoraIngreso = detenido.fehaHoraIngreso;
        let oficioRetencion = detenido.oficioRetencion;
        let dependenciaId = detenido.dependenciaDetencionID;
        let observaciones = detenido.observaciones;
        let nombreDetenido = detenido.nombreDetenido;
        let apellidoPaternoDetenido = detenido.apellidoPaternoDetenido;
        let apellidoMaternoDetenido = detenido.apellidoMaternoDetenido;
        let nacionalidadId = detenido.nacionalidadID;
        let otroNombre = detenido.otrosNombres;


        //Se mapea con el modelo que se traia desde la consulta
        detenido = this.modeloDetenido;
        //Se asigna con los nuevos parametros que el usuario cambio en el form
        detenido.fehaHoraIngreso = fehaHoraIngreso;
        detenido.oficioRetencion = oficioRetencion
        detenido.dependenciaDetencionID = dependenciaId;
        detenido.observaciones = observaciones;
        detenido.nombreDetenido = nombreDetenido;
        detenido.apellidoPaternoDetenido = apellidoPaternoDetenido;
        detenido.apellidoMaternoDetenido = apellidoMaternoDetenido;
        detenido.nacionalidadID = nacionalidadId;
        detenido.otrosNombres = otroNombre;
        detenido.aliasesEdit = this.listaAlias;
      //  detenido.delitosEdit = this.listaDelitosID;
        detenido.delitosEdit = this.listaDelitosID;
        this.detenidoServices.editarDetenido(this.modeloDetenido.id,detenido).subscribe(
          (crearDetenido : HttpResponse<DetenidosDTO[]>|any) => {
            if(crearDetenido == true){

              this.mensajeService.MensajeSwal('Registro editado correctamente',  'success');
              // this.dialog.closeAll();
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
       for(let i=0 ;i<= this.listaAlias.length ;i++)
       {
          if(detenido== this.listaAlias[i])
          {
            this.listaAlias.splice(i,1);
            this.listaAliasF.splice(i,1)
            // console.log(this.lista);
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
            else{

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


         //dependientes Delitos
         onChangeClasificaDelito(delitoID:number){
          this.catalogosService.getCatClasificacionDelitoPFM(delitoID)
          .subscribe(clasificaciondelito =>{
            this.listaClasificacionDelitoPFM = clasificaciondelito.body

          })
        }

  }



