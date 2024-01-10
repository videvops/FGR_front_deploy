import { AfterContentInit, ChangeDetectorRef, Component, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catSeparosDTO } from 'src/app/models/catalogos/catSeparos';
import { UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import { MatTableDataSource } from '@angular/material/table';
import { ListColumn } from 'src/@fury/shared/list/list-column.model';
import { fadeInRightAnimation } from 'src/@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@fury/animations/fade-in-up.animation';
import { Detenidos } from 'src/app/models/detenidos/detenidos';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree'
import { SelectionModel } from '@angular/cdk/collections';
import { DetenidosService } from 'src/app/services/common/detenidos.service';
import { MensajesService } from 'src/app/services/utilidades/snackbar-mensajes.service';
import { parsearErroresAPI } from 'src/app/utils/utils';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ChecklistDatabase, EntidadNodeArbol, TodoItemFlatNode, TodoItemNode } from './nodo';


@Component({
  selector: 'detenciones-modal-separo',
  templateUrl: './modal-separo.component.html',
  styleUrls: ['./modal-separo.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
  providers: [ChecklistDatabase],
})

export class ModalSeparoComponent  {
  private _gap = 16;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;



  @Input()
  modeloUser! : UserDTO

  @Input()
  userID! : number;

  listaSeparos : catSeparosDTO[]=[]; 
  listaIDs: number[] = [];


  modeloUbicaciones : EntidadNodeArbol[]=[];
  
  //Para mostrar los errores
  errores: string[] = [];
  
  /** Mapa que traduce la información de un nodo a un subnodo */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Mapa que traduce la información de un subnodo a un nodo */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl!: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener!: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource!: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;


  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  

  constructor(private catalogosService : CatalogosService,
              private detenidosService : DetenidosService,
              public dialog: MatDialog, 
              public mensajeService: MensajesService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: UserDTO,
              private database: ChecklistDatabase,
              

              
    ) {
      this.modeloUser = {...data.user}
      this.detenidosService.establecerDatosUsuario(data);


      if(data !== undefined) {
        
              this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
                this.isExpandable, this.getChildren);
              this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
              this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        
              database.dataChange.subscribe(data => {
                this.dataSource.data = data;
                
                // Si la data no viene sin nodos, se llama a las ubicaciones permitidas del usuario.
                if (data.length > 0) {
                  
                  this.detenidosService.modeloEntidadSedeSeparo(this.modeloUser.id)
                  .subscribe((modelo : HttpResponse<any[]> | any) => {

                   if (modelo.body.length>0){

                    this.verificarChecks(modelo.body);
                    this.modeloUbicaciones = modelo.body;
                   
                   
                   }
                   else{
                    this.modeloUbicaciones = modelo.body;
              
                   }
             
                 }
                 ,errores => this.errores = parsearErroresAPI(errores));
             
                } else {
                
                  
                }
              });
          }

   
}

verificarChecks(ubicacionesPerm: EntidadNodeArbol[]) {
  let listaIDsSeleccionados: number[] = [];
  let listaEntidades: number[] = [];
 
  ubicacionesPerm.forEach(ubicacion => {
    ubicacion.sedes?.forEach(sede => {
      listaIDsSeleccionados.push(sede.sedeSubsedeID);
    });
    listaEntidades.push(ubicacion.catEntidadFederativaID);
  });
  this.treeControl.dataNodes.forEach(nodoActual => {
    if (!this.checklistSelection.isSelected(nodoActual) && listaIDsSeleccionados.includes(nodoActual.item.sedeSubsedeID)) {
      this.checklistSelection.toggle(nodoActual);
    }
    if(listaEntidades.includes(nodoActual.item.catEntidadFederativaID)) {
      this.treeControl.expand(nodoActual);
    }
  });
}

getLevel = (node: TodoItemFlatNode) => node.level;

isExpandable = (node: TodoItemFlatNode) => node.expandable;

getChildren = (node: TodoItemNode): TodoItemNode[] | undefined => node.children;

hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
   transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
   

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  ngOnInit(): void {
   
  }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {

      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      return descAllSelected;
    }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Evalúa la selección de items. Selecciona / deselecciona todos los nodos descendientes */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node) 
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
 

    // Se fuerza a actualizar al padre.
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);

  }

    /** Selecciona todos los padres cuando un nodo se selecciona o deselecciona. */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
      let parent: TodoItemFlatNode | null = this.getParentNode(node);
      while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
      }
    }

  /** Evalúa la selección de items. Se revisa a todos los nodos padres para ver si cambiaron. */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

      /* Se obtiene el nodo papá del nodo */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


    /** Revisa el estado del nodo seleccionado y lo cambia. */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
      const nodeSelected = this.checklistSelection.isSelected(node);
      const descendants = this.treeControl.getDescendants(node);
  
      const descAllSelected = descendants.length > 0 && descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
      if (nodeSelected && !descAllSelected) {
        this.checklistSelection.deselect(node);
      } else if (!nodeSelected && descAllSelected) {
        this.checklistSelection.select(node);
      }
    }

    
asignarSeparo() {
  // Se obtienen sólo los Id's de los checks seleccionados.
 this.listaIDs = [];

  this.checklistSelection.selected.forEach(seleccionado => {
    if(seleccionado.item.sedeSubsedeID != undefined){
      this.listaIDs.push(seleccionado.item.sedeSubsedeID);
    }
  });
 

 
  this.detenidosService.insertSeparoUsuario(this.modeloUser.id,this.listaIDs).subscribe(
    (asignarSeparos : HttpResponse<any[]>|any) => {
    
      if(asignarSeparos.ok==true){
        this.mensajeService.MensajeSwal('Se asiganaron las sedes/subsedes correctamente',  'success');

        this.detenidosService.modeloEntidadSedeSeparo(this.modeloUser.id)
                  .subscribe((modelo : HttpResponse<any[]> | any) => {
                   if (modelo.body.length>0){
                    this.verificarChecks(modelo.body);
                    this.modeloUbicaciones = modelo.body;
                   }
                   else{
                    this.modeloUbicaciones = modelo.body;
                   }
                 }
                 ,errores => this.errores = parsearErroresAPI(errores));
      }  
    },errores => this.errores = parsearErroresAPI(errores));

}

editarAsignacionSeparo(){
  this.listaIDs = [];
  this.checklistSelection.selected.forEach(seleccionado => {
    if(seleccionado.item.sedeSubsedeID != undefined){
      this.listaIDs.push(seleccionado.item.sedeSubsedeID);
    }
  });
 
  this.detenidosService.editSeparoUsuario(this.modeloUser.id,this.listaIDs).subscribe(
    (editarAsignacionSeparos : HttpResponse<any[]>|any) => {
      if(editarAsignacionSeparos.ok==true){
        this.mensajeService.MensajeSwal('Se edito la asiganación de las sedes/subsedes correctamente',  'success');

        this.detenidosService.modeloEntidadSedeSeparo(this.modeloUser.id)
                  .subscribe((modelo : HttpResponse<any[]> | any) => {
                   if (modelo.body.length>0){
                    this.verificarChecks(modelo.body);
                    this.modeloUbicaciones = modelo.body;
                   }
                   else{
                    this.modeloUbicaciones = modelo.body;
                   }
                 }
                 ,errores => this.errores = parsearErroresAPI(errores));
      }
       
    },errores => this.errores = parsearErroresAPI(errores));

}


cancelar() {
  this.dialog.closeAll();
}





}


