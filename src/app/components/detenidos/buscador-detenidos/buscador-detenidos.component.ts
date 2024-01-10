import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { catAutoridadCargoDetencionDTO } from 'src/app/models/catalogos/catAutoridadCargoDetencion';
import { catDelitoDTO } from 'src/app/models/catalogos/catDelito';
import { catMotivoEgreso } from 'src/app/models/catalogos/catMotivoEgreso';
import { catNacionalidadDTO } from 'src/app/models/catalogos/catNacionalidad';
import { formBuscadorDetenidos } from 'src/app/models/detenidos/formBuscador';
import { MyErrorStateMatcher } from 'src/app/models/seguridad/usuarios/error-state-matcher';
import { CatalogosService } from 'src/app/services/common/catalogos.service';

@Component({
  selector: 'detenciones-buscador-detenidos',
  templateUrl: './buscador-detenidos.component.html',
  styleUrls: ['./buscador-detenidos.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})
export class BuscadorDetenidosComponent implements OnInit {

  private _gap = 10;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(25% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 2}px)`; 
  matcher = new MyErrorStateMatcher();

  width!: number;
  height!: number;

    // Valores del select 
    listaAutoridadCargoDetencion: catAutoridadCargoDetencionDTO[] = [];
    listaNacionalidad : catNacionalidadDTO[]=[];
    listaDelito : catDelitoDTO[]=[]; 
    listaMotivoEgreso : catMotivoEgreso[]=[]; 
  
  constructor(
    private formBuilder: FormBuilder, 
    private catalogosService: CatalogosService, 
  ) { }
  
  @Input()
  formFiltro!: FormGroup;  

  @Output()
  emisorFormulario: EventEmitter<formBuscadorDetenidos> = new EventEmitter<formBuscadorDetenidos>();


  ngOnInit(): void {
    this.formFiltro = this.formBuilder.group({
      fechaIngresoInicial:[],
      fechaIngresoFinal:[],
      numeroDetenido:[],
      anio:[new Date().getUTCFullYear().toString()],
      nacionalidadID: [],
      nombre:[],
      aPaterno:[],
      aMaterno:[],
      alias:[],
      oficioRetencion:[],
      dependenciaDetencionID:[],
      catDelitoID:[],
      fechaEgresoInicial:[],
      fechaEgresoFinal :[],
      motivoEgresoID : [],
      ficha : [false],
    
  
      
    });

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
  }


      buscar(busqueda : formBuscadorDetenidos){
        this.emisorFormulario.emit(busqueda);
        // console.log(busqueda);
       }



      
}
