import { HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChildActivationStart } from '@angular/router';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { GestionCenapiService } from 'src/app/services/common/gestionCenapi.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';

@Component({
  selector: 'detenciones-archivo-detenido-cenapi',
  templateUrl: './archivo-detenido-cenapi.component.html',
  styleUrls: ['./archivo-detenido-cenapi.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class ArchivoDetenidoCenapiComponent implements OnInit {
  
private _gap = 10;
gap = `${this._gap}px`;
col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;  

id!:number;

shortLink: string = "";
loading: boolean = false; // Flag variable
file!: File ;

@Input()
formUpload!: FormGroup; 

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number,
    public mensajeService: MensajesService,
    private formBuilder: FormBuilder, 
    private gestionCenapiService : GestionCenapiService,
    private dialog:MatDialog,
  ) { 
    this.id = data ;
  }

  ngOnInit(): void {
    // console.log(this.id);

    //DESCOMENTAR EN CASO QUE SE REQUIERA EL CAMPO DE OBSERVACIONES AL UPLOAD
    // this.formUpload = this.formBuilder.group({
    //   observaciones: ['', Validators.required],
    // });
    
  }

  onCarga(event:any,id:number)
  {
    console.log(event);
    const archivo: any = event.target.files[0];
    this.file = event.target.files[0];

    if(archivo)
    {
      // el tamaño no debe ser mayor a 20 mb
      if(archivo.size <= 20000000)
      {
    
      
      } 
      
      else {
        this.mensajeService.MensajeErrorStr("No se Aceptan Archivos Mayores a 20MB","x");
      }
    }
  }

//En caso que necesite observaciones
  // onUpload(formUpload : string ) {
  //   this.loading = !this.loading;
  //   console.log(this.file);
  //   console.log(formUpload);
  //SE NECESITA PONER EL SERVICE CON EL ENDPOINT HACIA LA API

// }

//Solo se enviara el archivo que se subira
onUpload() {
  this.loading = !this.loading;

  this.gestionCenapiService.uploadFile(this.id,this.file).subscribe((result: HttpResponse<any[]> | any )=> {

    this.mensajeService.MensajeSwal('El archivo se cargo correctamente');
    this.dialog.closeAll();

  
  },
  error => {
   console.log("Error al subir archivo")
  });

}

}
