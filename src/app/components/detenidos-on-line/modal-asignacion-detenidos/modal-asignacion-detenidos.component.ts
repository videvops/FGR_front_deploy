import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'detenciones-modal-asignacion-detenidos',
  templateUrl: './modal-asignacion-detenidos.component.html',
  styleUrls: ['./modal-asignacion-detenidos.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class ModalAsignacionDetenidosComponent implements OnInit {

  private _gap = 10;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;  

  constructor() {}


ngOnInit(): void {
  
  console.log("modal Asignacion")
}


  }

