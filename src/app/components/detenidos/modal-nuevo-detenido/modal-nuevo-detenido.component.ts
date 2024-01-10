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
import { Detenidos, DetenidosDTO, DetenidosDTO_Net } from 'src/app/models/detenidos/detenidos';

import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { parsearErroresAPI } from 'src/app/utils/utils';
//Agregado por Gustavo Diego
import { catDelitoPFMDTO } from 'src/app/models/catalogos/catDelitoPFM';
import { catDelitoModalidadPrometheusPFMDTO } from 'src/app/models/catalogos/catDelitoModalidadPrometheusPFM';

import { CatDelitoModalidadPrometheusPFM } from 'src/app/models/detenidos/catdelitomodalidadprometheuspfm';
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

    formEntidad : formEntidadDTO[]=[];


    sedeSubsedeID! : number;
    separoID! : number;

    entidadNombre! : string;
    sedeNombre! : string;
    separoNombre! : string;

  
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

  banderaDelito:boolean = false;

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

    //Para mostrar los errores
    errores: string[] = [];

   
 

  ngOnInit(): void {

     //Iniciamos con la validacion del formulario detenido con mas de una sede
 this.formDetenido = this.formBuilder.group({

  fechaHoraIngreso: ['', Validators.required],
  nombreDetenido: ['', Validators.required],
  apellidoPaterno: ['', Validators.required],
  apellidoMaterno: ['', Validators.required],
  nacionalidadDetenido: [110, Validators.required],
  numeroOficio:['', [Validators.required,Validators.maxLength(50),this.validacionOficio()]],
  dependenciaDetencion: ['', Validators.required],
  delito: [''],
  clasificacion: [''],
  observaciones: [''],
  alias:[''],
  entidadFederativa:['' , Validators.required], 
  nombreSedeSubsede:['', Validators.required],
  nombreSeparo:['', Validators.required],
  otrosNombres:[''],
 
  

});

    this.detenidoServices.modeloEntidadSedeSeparo(this.seguridadService.getUserId().toString())
    .subscribe(modelo =>{

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

       this.catalogosService.getCatSeparo(modelo.body[x].sedes[x].sedeSubsedeID)
                   .subscribe(separo=> {
                     this.listaSeparo = separo.body;
                     this.separoNombre = separo.body[0].nombreSeparo;
                     this.formDetenido.patchValue({
                      nombreSeparo: separo.body[0].catSeparoID
                     })
                   
                   })
      }
    
      }
    })




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

  

    // this.catalogosService.getCatDelito()
    // .subscribe(delito => {
    //   this.listaDelito = delito.body;
    // })


 //Agregado por Gustavo Diego
 this.catalogosService.getCatDelitoPFM()
 .subscribe(delitoPFM => {
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
    
      //En este caso se enviara la solicitud CENAPI
      detenido.enviado = true;

      if(detenido !== undefined){
        detenido.aliases = this.listaAlias;
        detenido.delitos = this.listaDelitosID;
        detenido.catSeparoID = this.formDetenido.get('nombreSeparo')?.value
    
        this.detenidoServices.insertDetenido(detenido).subscribe(
          (detenidoCrear : HttpResponse<Detenidos[]>|any) => {
          console.log(this.listaDelitosID);
            if(detenidoCrear != null){
            
              this.listaAlias = [];
              // this.listaDelitos = [];
              
              this.formDetenido.patchValue({
                alias : '',
                delito: '',
                clasificacion:'',
                nombreDetenido: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                nacionalidadDetenido: 110,
                nombreSeparo: this.formDetenido.get('nombreSeparo')?.value,
                otrosNombres:'',
    
              })
  
                this.mensajeService.MensajeSwal('Registro correcto con Folio Nacional: '+ detenidoCrear.folioIngreso + ', Folio Estatal: '+ detenidoCrear.folioEstatal,  'success');
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
    // console.log(autor); 
     for(let i=0 ;i<= this.listaAlias.length ;i++)
     {
        if(detenido== this.listaAlias[i])
        {
          this.listaAlias.splice(i,1)  
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
          if(delitoEncontrado.catClasificaDelitoID != 0){
            detenido["catdelitomodalidadprometheuspfm"] = delitoEncontrado;
            //if(detenido.clasificacion != null && detenido.clasificacion  != ""){
            if(this.listaDelitosID.length == 0){
              this.listaDelitos.push(detenido.catdelitomodalidadprometheuspfm.clasificacion);
              this.listaDelitosID.push(detenido.catdelitomodalidadprometheuspfm.catClasificaDelitoID);
              this.dataDelito.data = this.listaDelitos;
        
              console.log(this.listaDelitos);
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

    

      
}
