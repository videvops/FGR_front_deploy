import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detenidos-listado-generico',
  templateUrl: './listado-generico.component.html',
  styleUrls: ['./listado-generico.component.css']
})
export class ListadoGenericoComponent implements OnInit {
  @Input()
  listado: any;
  constructor() { }

  @Input()
  mensajeVacio = "No hay elementos para mostrar";

  ngOnInit(): void {
  }

}
