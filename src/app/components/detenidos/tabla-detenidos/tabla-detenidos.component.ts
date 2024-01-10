import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { Aliases } from 'src/app/models/detenidos/alias';
import { Detenidos, DetenidosDTO } from 'src/app/models/detenidos/detenidos';
import { formBuscadorDetenidos } from 'src/app/models/detenidos/formBuscador';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { formatearFecha, inicializarPaginador, parsearErroresAPI } from 'src/app/utils/utils';
import { ModalEditarDetenidosComponent } from '../modal-editar-detenidos/modal-editar-detenidos.component';
import { ModalNuevoDetenidoComponent } from '../modal-nuevo-detenido/modal-nuevo-detenido.component';

@Component({
  selector: 'detenciones-tabla-detenidos',
  templateUrl: './tabla-detenidos.component.html',
  styleUrls: ['./tabla-detenidos.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class TablaDetenidosComponent implements OnInit {
  cantidadTotalRegistros: number | null | undefined;
  paginaActual = 1;
  pageSize = 10;
  errores: string[] = [];
  //Declaracion para datos de la tabla
  dataSource : MatTableDataSource<Detenidos> | any;
  @ViewChild(MatSort, { static: true }) ordenamiento: MatSort | any;
  @ViewChild('paginator') paginador!: MatPaginator;

 //Declaracion de lista de roles para hacer la validaciones
  roles : string[]=[];

  //Declaracion de lista para delitos
  listaDelitos : string []=[];
 
  //DEclaracion para el estatus del detenido
  estatusDetenido ;

  // Se declara para mostrar el boton de agregar uno nuevo detenido
  toDisplay = true;
 

 

  constructor(
    private detenidosService : DetenidosService,
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
    
    
    // // { name: 'editar', property: 'editar', visible: true, isModelProperty: true },
    // { name: 'enviar', property: 'enviar', visible: true, isModelProperty: true },
    // { name: 'eliminar', property: 'eliminar', visible: true, isModelProperty: true },
    
    
   
    ] as ListColumn[];

    get visibleColumns() {
      return this.columns.filter(column => column.visible).map(column => column.property);
    }

  ngOnInit(): void {

   this.getRoles();
  
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

    getRoles(){
      this.roles = this.seguridadService.getRoles();
      if(this.roles.length > 1){
      for(let x = 0; x<this.roles.length;x++){ 
     
      }
    }
      else{
       if( this.roles[0] == "PFM_Consulta"){
        this.toDisplay = false;
       }
      }
    }



  getAllDetenidos(pagina: number, tamanioRegistros: number){ 
    this.detenidosService.getDetenidos(pagina, tamanioRegistros)
    .subscribe((detenidosData: HttpResponse<DetenidosDTO[]> | any) => {
      
      this.dataSource = detenidosData.body;
      // console.log(this.dataSource);
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

  modalDetenido(){
    // Manda los datos a una clase Modal para mostrar algunos campos de la nueva solicitud.
    this.dialog.open(ModalNuevoDetenidoComponent,
    
      {
        disableClose: true,
        width: '1500px',
        height: '1000px',
        data: {
        
        },
        })
        .beforeClosed()
        .subscribe((resultado) => {  
          if(resultado == null){
            this.getAllDetenidos(this.paginaActual, this.pageSize);
          }
        });
    (error) => console.error(error)
  }

  //servicio para traer el modelo del detenido
  obtenerModeloDetenido(detenidoId: string, estatusRegistro:string){
    this.detenidosService.modeloDetenido(detenidoId)
    .subscribe((modelo : HttpResponse<DetenidosDTO[]> | any) => {
      //Aqui se mapea el estatus del registro ya que el servicio del back no lo entrega y llega nulo
     modelo.estatusRegistro = estatusRegistro;
      this.dialog.open(ModalEditarDetenidosComponent,
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

    enviarSolicitud(id:string){
      console.log("Se envio la solicitud")
    }
    

}


