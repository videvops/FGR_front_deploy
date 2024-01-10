import { HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import b64toBlob from 'b64-to-blob';
import { DetenidosDTO } from 'src/app/models/detenidos/detenidos';
import { GestionCenapiService } from 'src/app/services/common/gestionCenapi.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { MyErrorStateMatcher } from '../../detenidos/modal-editar-detenidos/modal-editar-detenidos.component';

@Component({
  selector: 'detenciones-modal-fichas',
  templateUrl: './modal-fichas.component.html',
  styleUrls: ['./modal-fichas.component.scss']
})
export class ModalFichasComponent implements OnInit {

  private _gap = 10;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;  
  matcher = new MyErrorStateMatcher();

   //parseo para el modelo
   @Input()
   modeloDetenido!: DetenidosDTO;

   formFichas! : FormGroup; 

    // Valor del select 
    listaFichas: any[] = [];

    nombreUnico! : string;

  constructor(
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DetenidosDTO,
    private gestionCenapiService : GestionCenapiService,
    private mensajeService: MensajesService,  ) 
    { 
      this.modeloDetenido = { ...data };
    }

  ngOnInit(): void {

    //Se asigna los valores de las fichas para meterlos en un select
    this.listaFichas = this.modeloDetenido.fichas;
    
    this.formFichas = this.formBuilder.group({ 
      fichaDetenido:['',Validators.required],
    })
  }

  onChangeFicha(nombreUnico : string){
    this.nombreUnico = nombreUnico;
  }

  verFicha(){

    this.gestionCenapiService.verFicha(this.modeloDetenido.id, this.nombreUnico).subscribe((respuesta : HttpResponse<any[]> | any) => {
     
     
      let cadena64 = b64toBlob(respuesta.body.cadena64, respuesta.body.tipoArchivo);

      // Se crea la URL con la que se prepara el contenido en base 64.
      var blobUrl = URL.createObjectURL(cadena64);
      // Finalmente se abre en una pestaña externa el contenido (si es posible verlo).
      // // Si no, se descargarán los datos para que el usuario abra el archivo de forma local.
      // window.open(blobUrl);


   
      let visor = this.mensajeService.MostrarArchivo(blobUrl);

      if (visor) {
        const noContext = document.getElementById('noContextMenu');
        if(noContext != null){
        noContext.addEventListener('contextmenu', e => e.preventDefault(),false);
        visor.finally(() =>{
          //debugger;
          URL.revokeObjectURL(blobUrl);
          noContext.removeEventListener('contextmenu',e => e.preventDefault(),false);
          
        });
      }
      }

    });  

  }

}
