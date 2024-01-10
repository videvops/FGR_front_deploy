import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { JsTreeModel } from 'src/app/models/seguridad/jstree.model';
import { PlantillasPorFiscalia } from 'src/app/models/seguridad/plantillas-por-fiscalia/plantilla-fiscalia.model';
import { PermisoPlantillasService } from 'src/app/services/seguridad/plantillas/permiso-plantillas.service';

declare var $: any;

@Component({
  selector: 'senap-edit-permisos-plantillas',
  templateUrl: './edit-permisos-plantillas.component.html',
  styleUrls: ['./edit-permisos-plantillas.component.scss']
})
export class EditPermisosPlantillasComponent implements OnInit {

  form: FormGroup | any;
  mode: 'create' | 'update' = 'create';
  errores: string[] = [];
  plantillasSeleccionadas: string[] = [];
  plantillasSeleccionadasModel: JsTreeModel[] = [];
  plantillasSeleccionadasOriginal: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: PlantillasPorFiscalia,
              private dialogRef: MatDialogRef<EditPermisosPlantillasComponent>,
              private fb: FormBuilder,
              private permisoPlantillasService: PermisoPlantillasService) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as PlantillasPorFiscalia;
    }

    this.form = this.fb.group({
      catFiscaliaID: [this.defaults.catFiscaliaID],
      nombreFiscalia: [this.defaults.nombreFiscalia],
      catEntidadFederativaID: [this.defaults.catEntidadFederativaID],
      //entidadFederativa: [this.defaults.entidadFederativa],
      mnemonico: [this.defaults.mnemonico],
      latitud: [this.defaults.latitud],
      longitud: [this.defaults.longitud],
      totalPlantillas: [this.defaults.totalPlantillas, { validators: [ Validators.min(1) ] }]
    });

    this.permisoPlantillasService.getPlantillas(this.defaults.catFiscaliaID).subscribe((response: HttpResponse<JsTreeModel[]> | any) => {
      of(response.body.map((model: any) => new JsTreeModel(model))).subscribe(result => {
        this.plantillasSeleccionadasModel = result[0].children;
        this.plantillasSeleccionadasModel.forEach(element => {
          if (element.state.selected) {
            this.plantillasSeleccionadasOriginal.push(element.id.toString());
          }
        });

        //console.log(this.plantillasSeleccionadasOriginal);

        //$(() => {
          // 6 create an instance when the DOM is ready
          $('#jstree').jstree({
            'plugins': ["wholerow", "checkbox"],
            'core': {
              "data": result,
              'themes': {
                "icons": false
              }
            },
            "checkbox": {
                "keep_selected_style": false
            }
          });

          // 7 bind to events triggered on the tree
          $('#jstree').on("changed.jstree",  (e: any, data: any) => {
            if (data.selected) {
              this.plantillasSeleccionadas = [];
              var tree = $('#jstree').jstree();
              // gets the selected nodes
              var selectedNodeIds = tree.get_selected();
              selectedNodeIds.forEach((nodeId: any) => {
                var node = tree.get_node(nodeId);
                if (!tree.is_parent(node)) {
                  this.plantillasSeleccionadas.push(node.id);
                }
              });

              this.form.controls['totalPlantillas'].setValue(this.plantillasSeleccionadas.length);
            }
          });

          /*$('#jstree').on('activate_node.jstree', function (e, data) {
            if (data == undefined || data.node == undefined || data.node.id == undefined) return;
            alert('clicked node: ' + data.node.id);
          });*/

          // 8 interact with the tree - either way is OK
          /*$('button').on('click', function () {
            $('#jstree').jstree(true).select_node('child_node_1');
            $('#jstree').jstree('select_node', 'child_node_1');
            $.jstree.reference('#jstree').select_node('child_node_1');
          });*/
        //});
      });
    });

    /* EXAMPLE
    $('#jstree1')
  .jstree({
    core: {
      data: treeData,
      check_callback: true  // don't forget to set this param to true
    }
  });

$(".delete-node").click(function() {
  var tree = $('#jstree1').jstree();
  // gets the selected nodes
  var selectedNodeIds = tree.get_selected();
  selectedNodeIds.forEach(function(nodeId) {
    var node = tree.get_node(nodeId);
    if (!tree.is_parent(node)) {
      tree.delete_node(node)
    }
  });
});
    */
  }

  save() {
    if (this.mode === 'create') {
      this.createPlantillas();
    } else if (this.mode === 'update') {
      this.updatePlantillas();
    }
  }

  createPlantillas() {
    /*const userDTO = this.form.value;
    const createUserDTO = new CreateUserDTO(userDTO);

    // Create user in backend
    this.usuariosService.createUser(createUserDTO).subscribe(() => {
      this.dialogRef.close(userDTO);
    }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);*/
  }

  updatePlantillas() {
    const fiscalia = this.form.value;
    fiscalia.catFiscaliaID = this.defaults.catFiscaliaID;

    //console.log(this.form.value);
    //console.log(this.plantillasSeleccionadas);

    const equals = (a: any, b: any) => a.length === b.length && a.every((v: any, i: any) => v === b[i]);

    if (equals(this.plantillasSeleccionadasOriginal, this.plantillasSeleccionadas)) {
      this.dialogRef.close(fiscalia);
    } else {
      // Update user in backend
      this.permisoPlantillasService.updatePlantillas(fiscalia.catFiscaliaID, this.plantillasSeleccionadas).subscribe(() => {
        this.dialogRef.close(fiscalia);
      }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);
    }
  }

  cancel(event: any) {
    event.preventDefault();
    this.dialogRef.close(this.defaults);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

}
