import { Component, Input, OnInit } from '@angular/core';
import { MultipleSelectorModel } from './MultipleSelectorModel';

@Component({
  selector: 'senap-selector-multiple',
  templateUrl: './selector-multiple.component.html',
  styleUrls: ['./selector-multiple.component.scss']
})
export class SelectorMultipleComponent implements OnInit {

  constructor() { }

  @Input()
  Seleccionados: MultipleSelectorModel[] = [];

  @Input()
  NoSeleccionados: MultipleSelectorModel[] = [];

  ngOnInit(): void {
  }

  seleccionar(opcion: MultipleSelectorModel, indice: number) {
    this.Seleccionados.push(opcion);
    this.NoSeleccionados.splice(indice, 1);
  }

  deseleccionar(opcion: MultipleSelectorModel, indice: number) {
    this.NoSeleccionados.push(opcion);
    this.Seleccionados.splice(indice, 1);
  }

  seleccionarTodo() {
    this.Seleccionados.push(...this.NoSeleccionados);
    this.NoSeleccionados = [];
  }

  deseleccionarTodo() {
    this.NoSeleccionados.push(...this.Seleccionados);
    this.Seleccionados = [];
  }
}





