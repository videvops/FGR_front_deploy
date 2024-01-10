import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import b64toBlob from 'b64-to-blob';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { Detenidos, DetenidosDTO } from 'src/app/models/detenidos/detenidos';
import { formBuscadorDetenidos } from 'src/app/models/detenidos/formBuscador';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { GestionCenapiService } from 'src/app/services/common/gestionCenapi.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { formatearFecha, inicializarPaginador, parsearErroresAPI } from 'src/app/utils/utils';
import { ModalEditarDetenidosComponent } from '../../detenidos/modal-editar-detenidos/modal-editar-detenidos.component';
import { ModalNuevoDetenidoComponent } from '../../detenidos/modal-nuevo-detenido/modal-nuevo-detenido.component';
import { ArchivoDetenidoCenapiComponent } from '../archivo-detenido-cenapi/archivo-detenido-cenapi.component';
import { ModalAsignacionDetenidosComponent } from '../modal-asignacion-detenidos/modal-asignacion-detenidos.component';
import { ModalDatosDetenidosComponent } from '../modal-datos-detenidos/modal-datos-detenidos.component';
import { ModalFichasComponent } from '../modal-fichas/modal-fichas.component';

@Component({
  selector: 'detenciones-tabla-detenidos-online',
  templateUrl: './tabla-detenidos-online.component.html',
  styleUrls: ['./tabla-detenidos-online.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class TablaDetenidosOnlineComponent implements OnInit {
  cantidadTotalRegistros: number | null | undefined;
  paginaActual = 1;
  pageSize = 10;
  errores: string[] = [];
  //Declaracion para datos de la tabla
  dataSource : MatTableDataSource<Detenidos> | any;
  @ViewChild(MatSort, { static: true }) ordenamiento: MatSort | any;
  @ViewChild('paginator') paginador!: MatPaginator;

  //Declaracion de lista para delitos
  listaDelitos : string []=[];
  estatusDetenido ;
 

 

  constructor(
    private detenidosService : DetenidosService,
    private gestionCenapiService : GestionCenapiService,
    private dialog:MatDialog,
    private mensajeService: MensajesService,
    private seguridadService : SeguridadService,

  ) { }

  subject$: ReplaySubject<DetenidosDTO[]> = new ReplaySubject<DetenidosDTO[]>(1);
  data$: Observable<DetenidosDTO[]> = this.subject$.asObservable();
  
  @Input()
  columns: ListColumn[] = [
    { name: 'folioIngreso', property: 'folioIngreso', visible: true,  isModelProperty: true },
    { name: 'folioEstatal', property: 'folioEstatal',visible:true, isModelProperty:true},
    { name: 'entidadFederativa', property: 'entidadFederativa', visible: true,  isModelProperty: true },
    { name: 'fehaHoraIngreso', property: 'fehaHoraIngreso', visible: true,  isModelProperty: true },
    { name: 'nombreDetenido', property: 'nombreDetenido', visible: true,  isModelProperty: true },
    // { name: 'nacionalidad', property: 'nacionalidad', visible: true,  isModelProperty: true },
    { name: 'oficioRetencion', property: 'oficioRetencion', visible: true,  isModelProperty: true },
    { name: 'dependenciaDetencion', property: 'dependenciaDetencion', visible: true,  isModelProperty: true },
    // { name: 'delitos', property: 'delitos', visible: true,  isModelProperty: true },
    // { name: 'oficioRetencion', property: 'oficioRetencion', visible: true,  isModelProperty: true },
    // { name: 'observaciones', property: 'observaciones', visible: true, isModelProperty: true },
    // { name: 'estatusRegistro', property: 'estatusRegistro', visible: true, isModelProperty: true },
    
    
    // { name: 'editar', property: 'editar', visible: true, isModelProperty: true },
    // { name: 'asignar', property: 'asignar', visible: true, isModelProperty: true },
    { name: 'estatusRegistro', property: 'estatusRegistro', visible: true, isModelProperty: true },
    { name: 'adjuntar', property: 'adjuntar', visible: false, isModelProperty: true },
    { name: 'verFicha', property: 'verFicha', visible: false, isModelProperty: true },

    
    
   
    ] as ListColumn[];

    get visibleColumns() {
      return this.columns.filter(column => column.visible).map(column => column.property);
    }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.getAllDetenidos(this.paginaActual, this.pageSize);
    this.dataSource.paginator = this.paginador;
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    inicializarPaginador(this.paginador);
  }
    //filtro en la tabla
    onFilterChange(value: any) {
      if (!this.dataSource) {
        return;
      }
      value = value.trim();  
      value = value.toLowerCase();
      this.dataSource.filter
      this.dataSource.filter = value; 
    }



  getAllDetenidos(pagina: number, tamanioRegistros: number){ 
    this.gestionCenapiService.getDetenidosCenapi(pagina, tamanioRegistros)
    .subscribe((detenidosData: HttpResponse<DetenidosDTO[]> | any) => {
      
      this.dataSource = detenidosData.body;
  
      //Se hacen bucles para recorrer cada arreglo dentro del objeto y asi poderlo mostrar en la tabla
        for(let contadorDetenidos = 0 ; contadorDetenidos < Object.keys(detenidosData.body).length;contadorDetenidos++){
          detenidosData.body[contadorDetenidos].fehaHoraIngreso = formatearFecha(detenidosData.body[contadorDetenidos].fehaHoraIngreso,true);
         
          //Empieza para seleccionar los delitos
          for(let contadorDelitos = 0 ; contadorDelitos < Object.keys(detenidosData.body[contadorDetenidos].delitos).length;contadorDelitos++){
            this.listaDelitos.push(detenidosData.body[contadorDetenidos].delitos[contadorDelitos].delito);
          }
          detenidosData.body[contadorDetenidos].delitos = this.listaDelitos;
          this.listaDelitos = [];

          //Empieza para los estatus (solo se tomara el ultimo)
          for(let contadorEstatus = 0 ; contadorEstatus < Object.keys(detenidosData.body[contadorDetenidos].estatusRegistro).length;contadorEstatus++){
           let x = (Object.keys(detenidosData.body[contadorDetenidos].estatusRegistro).length -1);
            if(contadorEstatus == x ){
              this.estatusDetenido = detenidosData.body[contadorDetenidos].estatusRegistro[contadorEstatus].estatus;
            } 
          }
          detenidosData.body[contadorDetenidos].estatusRegistro = this.estatusDetenido;
          this.estatusDetenido = null;
          
        }
    
        this.cantidadTotalRegistros = detenidosData.headers.get("cantidadTotalRegistros"); 
           this.dataSource.sort = this.ordenamiento;
           if (Object.keys(detenidosData.body).length == 0 && this.paginaActual > 1) {
             this.paginador.pageIndex--;
             this.paginaActual--;
           }

     });
  }

  cargaDetenidos(busqueda : formBuscadorDetenidos){ 
    this.detenidosService.getDetenidosBuscador(busqueda, this.paginaActual, this.pageSize) 
    .subscribe((detenidosData: HttpResponse<formBuscadorDetenidos[]> | any) => {

      this.dataSource = detenidosData.body;
      
      //Se hacen bucles para recorrer cada arreglo dentro del objeto y asi poderlo mostrar en la tabla
        for(let contadorDetenidos = 0 ; contadorDetenidos < Object.keys(detenidosData.body).length;contadorDetenidos++){
          detenidosData.body[contadorDetenidos].fehaHoraIngreso = formatearFecha(detenidosData.body[contadorDetenidos].fehaHoraIngreso,true);
         
          //Empieza para seleccionar los delitos
          for(let contadorDelitos = 0 ; contadorDelitos < Object.keys(detenidosData.body[contadorDetenidos].delitos).length;contadorDelitos++){
            this.listaDelitos.push(detenidosData.body[contadorDetenidos].delitos[contadorDelitos].delito);
          }
          detenidosData.body[contadorDetenidos].delitos = this.listaDelitos;
          this.listaDelitos = [];

          //Empieza para los estatus (solo se tomara el ultimo)
          for(let contadorEstatus = 0 ; contadorEstatus < Object.keys(detenidosData.body[contadorDetenidos].estatusRegistro).length;contadorEstatus++){
           let x = (Object.keys(detenidosData.body[contadorDetenidos].estatusRegistro).length -1);
            if(contadorEstatus == x ){
              this.estatusDetenido = detenidosData.body[contadorDetenidos].estatusRegistro[contadorEstatus].estatus;
            } 
          }
          detenidosData.body[contadorDetenidos].estatusRegistro = this.estatusDetenido;
          this.estatusDetenido = null;
          
        } 
        
        this.cantidadTotalRegistros = detenidosData.headers.get("cantidadTotalRegistros"); 
      
        this.dataSource.sort = this.ordenamiento;
        if (Object.keys(detenidosData.body).length == 0 && this.paginaActual > 1) {
          this.paginador.pageIndex--;
          this.paginaActual--;
        }

     });
  }

  // modalDetenido(){
  //   // Manda los datos a una clase Modal para mostrar algunos campos de la nueva solicitud.
  //   this.dialog.open(ModalNuevoDetenidoComponent,
    
  //     {
  //       disableClose: true,
  //       width: '1500px',
  //       height: '1000px',
  //       data: {
        
  //       },
  //       })
  //       .beforeClosed()
  //       .subscribe((resultado) => {  
  //         if(resultado == null){
  //           this.getAllDetenidos(this.paginaActual, this.pageSize);
  //         }
  //       });
  //   (error) => console.error(error)
  // }

  //servicio para traer el modelo del detenido
  obtenerModeloDetenido(detenidoId: string){
    this.gestionCenapiService.modeloDetenido(detenidoId)
    .subscribe((modelo : HttpResponse<DetenidosDTO[]> | any) => {
      this.dialog.open(ModalDatosDetenidosComponent, 
        {
          panelClass: 'myClass',
          disableClose: true,
          width: '1500px',
          height: '1100px',
          data: 
          modelo
          ,
          })
          .beforeClosed()
          .subscribe((resultado) => { 
            if(resultado == null || resultado == ""){
              this.getAllDetenidos(this.paginaActual, this.pageSize);
            }
          });
      (error) => console.error(error)
 

    
    }
    ,errores => this.errores = parsearErroresAPI(errores));
  }

    //servicio para asignacion
    modalAsignacion(detenidoId: string){
      this.gestionCenapiService.modeloDetenido(detenidoId)
      .subscribe((modelo : HttpResponse<DetenidosDTO[]> | any) => {
        this.dialog.open(ModalAsignacionDetenidosComponent, 
          {
            panelClass: 'myClass',
            disableClose: true,
            width: '1500px',
            height: '1100px',
            data: 
            modelo
            ,
            })
            .beforeClosed()
            .subscribe((resultado) => { 
              if(resultado == null || resultado == ""){
                this.getAllDetenidos(this.paginaActual, this.pageSize);
              }
            });
        (error) => console.error(error)
   
  
      
      }
      ,errores => this.errores = parsearErroresAPI(errores));
     
    }

  async eliminarDetenido(id:string){
    let confirmado = await this.mensajeService.MensajeSwalConfirmacion("¿Está seguro que desea borrar al detenido?");
    if(confirmado){
   this.detenidosService.eliminarDetenido(id).subscribe(() => {

     //Metodos para refrescar la tabla principal de delitos
     this.getAllDetenidos(this.paginaActual, this.pageSize);
   this.mensajeService.MensajeSwal('Se eliminó correctamente el detenido', 'success');  
 } , error => this.mensajeService.MensajeErrorStr('¡Algo ha fallado! Intente de nuevo','Error'));
}
  }

    //Actualzacion de la Paginacion de los detenidos
    actualizarPaginacion(datos: PageEvent) {
      this.paginaActual = datos.pageIndex + 1;
      this.pageSize = datos.pageSize;
      this.getAllDetenidos(this.paginaActual, this.pageSize);
    }

    modalAdjuntar(id:number){

      this.dialog.open(ArchivoDetenidoCenapiComponent, 
          {
            panelClass: 'myClass',
            disableClose: true,
            width: '750px',
            height: '200px',
             // <!-- DESCOMENTAR SI SE NECESITAN OBSERVACIONES Y COMETNAR LA LINEA DE ARRIBA -->
            //  height: '300px',
            data: 
            id
            ,
            })
            .beforeClosed()
            .subscribe((resultado) => { 
              if(resultado == null || resultado == ""){
                this.getAllDetenidos(this.paginaActual, this.pageSize);
              }
            });
        (error) => console.error(error)
    }
 
    

    onCarga(event:any,id:number)
    {
      const archivo: any = event.target.files[0];
      if(archivo)
      {
        // el tamaño no debe ser mayor a 20 mb
        if(archivo.size <= 20000000)
        {
      
          //service que conectara al api

          // this.cenapi.uploadHome(archivo,solicitudID).subscribe(result => {
          //   console.log("el hash generado es: " + result);
          // },
          // error => {
            
          // });
        } 
        
        else {
          this.mensajeService.MensajeErrorStr("No se Aceptan Archivos Mayores a 20MB","x");
        }
      }
    }

    //METODO PARA VER SI SOLO HAY UNA FICHA POR DETENIDO  
    // verFicha(id:number) {
    //   this.gestionCenapiService.verFicha(id,).subscribe((respuesta : HttpResponse<any[]> | any) => {
     
    //     console.log(respuesta.body);
    //     let cadena64 = b64toBlob(respuesta.body.cadena64, respuesta.body.tipoArchivo);

    //     // Se crea la URL con la que se prepara el contenido en base 64.
    //     var blobUrl = URL.createObjectURL(cadena64);
    //     // Finalmente se abre en una pestaña externa el contenido (si es posible verlo).
    //     // // Si no, se descargarán los datos para que el usuario abra el archivo de forma local.
    //     // window.open(blobUrl);


     
    //     let visor = this.mensajeService.MostrarArchivo(blobUrl);
  
    //     if (visor) {
    //       const noContext = document.getElementById('noContextMenu');
    //       if(noContext != null){
    //       noContext.addEventListener('contextmenu', e => e.preventDefault(),false);
    //       visor.finally(() =>{
    //         //debugger;
    //         URL.revokeObjectURL(blobUrl);
    //         noContext.removeEventListener('contextmenu',e => e.preventDefault(),false);
            
    //       });
    //     }
    //     }
  
    //   });    
    // }

     //se hereda los datos a
  modeloDetenidoFicha(detenidoId: string,fichas: string []){
      this.dialog.open(ModalFichasComponent, 
        {
          panelClass: 'myClass',
          disableClose: true,
          width: '400px',
          height: '250px',
          data: {
          id: detenidoId, fichas : fichas
          }
        })
          .beforeClosed()
          .subscribe((resultado) => { 
            if(resultado == null || resultado == ""){
              this.getAllDetenidos(this.paginaActual, this.pageSize);
            }
          });
      (error) => console.error(error)

  }



}


