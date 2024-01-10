import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { CatalogosService } from "src/app/services/common/catalogos.service";
import { DetenidosService } from "src/app/services/common/detenidos.service";



export interface EntidadNodeArbol {
    catEntidadFederativaID: number;
    entidadFederativa: string;
    nombreSedeSubsede: string;
    sedeSubsedeID: number;
    sedes?: EntidadNodeArbol[];
  }

/**
 * Nodos del árbol con su item.
 */
export class TodoItemNode {
    children!: TodoItemNode[] | undefined;
    item!: EntidadNodeArbol;
    nivel!: number;
}

/** SubNodo que brinda información sobre el nivel y si es expandible éste */
export class TodoItemFlatNode {
    item!: EntidadNodeArbol;
    level!: number;
    expandable!: boolean;
    disponible!: boolean;
}

/**
 * La clase que sirve como proveedor, puede construir
 * un árbol estructurado, y cada nodo representa un
 * item con un conjunto de características del mismo.
 * Si el nodo tiene hijos, cada uno tendrá su item (y posibles hijos también).
 * Si la situación lo requiriera, se pueden agregar nodos hijos.
 */
@Injectable()
export class ChecklistDatabase {

    dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    get data(): TodoItemNode[] { return this.dataChange.value; }

    dataUbicacionesPFMChange = new BehaviorSubject<EntidadNodeArbol[]>([]);
    get dataUbicacionesPFM(): EntidadNodeArbol[] { return this.dataUbicacionesPFMChange.value; }

    suscripcionUbicacion!: Subscription;

    constructor(private catalogosService : CatalogosService,
        private detenidosService : DetenidosService,) {

        // Obtengo la referencia de la suscripción para quitarla al destruir la clase.
        this.suscripcionUbicacion = detenidosService.obtenerDatosUsuario().subscribe(ubicacion => {
            //console.log(ubicacion);
            if(ubicacion !== undefined) {

                // Primero se obtiene el arbol de ubicaciones 
                this.catalogosService.getArbolSeparos()
                .subscribe(separos => {
                 //console.log(separos.body);
                 this.dataUbicacionesPFMChange.next(separos);
                        this.initialize(separos.body);
           });
            }
        });
    }

    ngOnDestroy() {
        if(this.suscripcionUbicacion) {
            this.suscripcionUbicacion.unsubscribe();
        }
    }


    private initialize(ubicacionesIniciales: EntidadNodeArbol[]) {
        let data: TodoItemNode[] = [];
        ubicacionesIniciales.forEach(ubicacion => {
            //console.log({u: ubicacion.ubicacionID, h: ubicacion.idsHijos, p: ubicacion.idsPadres});
           
                let nodo = new TodoItemNode();
                nodo.item = ubicacion;
                nodo.children = [];
                nodo.nivel = 0;
                
                if(ubicacion.sedes) {
                    ubicacion.sedes.forEach(sede => {
                        let nodo_subsede = new TodoItemNode();
                        nodo_subsede.item = sede;
                        nodo_subsede.children = undefined;
                        nodo_subsede.nivel = 1;
                        nodo.children?.push(nodo_subsede);
                    });
                }
                data.push(nodo);
            
        });
        // Se notifican los cambios en la data principal.
        this.dataChange.next(data);
    }



}

