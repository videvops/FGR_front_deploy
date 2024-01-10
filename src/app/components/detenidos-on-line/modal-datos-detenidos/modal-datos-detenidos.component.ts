import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { DetenidosDTO } from 'src/app/models/detenidos/detenidos';
import { MyErrorStateMatcher } from 'src/app/models/seguridad/usuarios/error-state-matcher';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';

@Component({
  selector: 'detenciones-modal-datos-detenidos',
  templateUrl: './modal-datos-detenidos.component.html',
  styleUrls: ['./modal-datos-detenidos.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class ModalDatosDetenidosComponent implements OnInit {

private _gap = 10;
gap = `${this._gap}px`;
col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;  
matcher = new MyErrorStateMatcher();

   //parseo para el modelo
   @Input()
   modeloDetenido!: DetenidosDTO;

       // Valores del select 
       listaAutoridadCargoDetencion: catAutoridadCargoDetencionDTO[] = [];
       listaNacionalidad : catNacionalidadDTO[]=[];
       listaDelito : catDelitoDTO[]=[]; 
       listaMotivoEgreso : catMotivoEgreso[]=[]; 
     
     @Input()
     formDetenido!: FormGroup; 
   
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

      
      public demo1TabIndex = 1;

constructor(
  private formBuilder: FormBuilder, 
  private catalogosService: CatalogosService, 
  private detenidoServices: DetenidosService, 
  public dialog: MatDialog, 
  public mensajeService: MensajesService,
  @Optional() @Inject(MAT_DIALOG_DATA) public data: DetenidosDTO,
  public datepipe: DatePipe,
) {
  this.modeloDetenido = { ...data };
 }


  //tabla de alias
  @Input()
  columns: ListColumn[] = [
    { name: 'alias', property: 'alias', visible: true,  isModelProperty: true },
  
   
    ] as ListColumn[];

    get visibleColumns() {
      return this.columns.filter(column => column.visible).map(column => column.property);
    }

    //tabla de delitos
  @Input()
  columnsDelito: ListColumn[] = [
    { name: 'delito', property: 'delito', visible: true,  isModelProperty: true },
   
   
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


      
 //Iniciamos con la validacion del formulario del detenido
 this.formDetenido = this.formBuilder.group({

  fehaHoraIngreso: [''],
  nombreDetenido: ['', Validators.required],
  apellidoPaternoDetenido: ['', Validators.required],
  apellidoMaternoDetenido: ['', Validators.required],
  nacionalidadID: [110, Validators.required],
  oficioRetencion:['', [Validators.required]],
  dependenciaDetencionID: ['', Validators.required],
  delito: [''],
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



}

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
    for(let x = 0; x < this.modeloDetenido.delitos.length;x++){
     // if(this.modeloDetenido.clasificaciones[x].catClasificaDelitoID != 0){
      this.listaDelitos.push(this.modeloDetenido.delitos[x].clasificacion);
      this.listaDelitosID.push(this.modeloDetenido.delitos[x].catClasificaDelitoID);
     // this.listaDelitosF.push(this.modeloDetenido.delitos[x]);
      this.dataDelito.data = this.listaDelitos;
     // }
    }
  

    this.formDetenido.disable();
  }


}

