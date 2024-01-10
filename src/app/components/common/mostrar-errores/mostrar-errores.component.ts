import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-mostrar-errores',
  templateUrl: './mostrar-errores.component.html',
  styleUrls: ['./mostrar-errores.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MostrarErroresComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MostrarErroresComponent),
      multi: true,
    }
  ]
})
export class MostrarErroresComponent implements OnInit {
  @Input()
  errores: string[] = [];
  @Input()
  tipoMensajes: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
