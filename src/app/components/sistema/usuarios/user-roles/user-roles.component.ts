import { SelectionModel } from '@angular/cdk/collections';
import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CatFiscaliasDTO } from 'src/app/models/catalogos/catFiscalias';
import { UserRoles } from 'src/app/models/seguridad/roles/user-roles.model';
import { CatStatusAccountDTO } from 'src/app/models/seguridad/usuarios/status-account.model';
import { UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { RolesService } from 'src/app/services/seguridad/roles/roles.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios/usuarios.service';
import { parsearErroresAPI } from 'src/app/utils/utils';

@Component({
  selector: 'senap-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  userRoles: UserRoles[] = [];
  //displayedColumns: string[] = ['select', 'id', 'name', 'descripcion', 'seleccionado'];
  displayedColumns: string[] = ['select', 'name', 'descripcion'];
  dataSource = new MatTableDataSource<UserRoles>();
  selection = new SelectionModel<UserRoles>(true, []);
  rolesSeleccionados: string[] = [];
  rolesOriginal: string[] = [];
  form: FormGroup | any;
  errores: string[] = [];

  botonDesactivado: boolean = true;
  //first: boolean = true;
  //errorType:boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: UserDTO,
              private dialogRef: MatDialogRef<UserRolesComponent>,
              private fb: FormBuilder,
              private catalogosService:CatalogosService,
              private usuariosService: UsuariosService,
              private rolesService: RolesService) {
  }

  ngOnInit() {
    this.rolesOriginal = [];
    this.rolesService.getUserRoles(this.defaults.id).subscribe((roles: HttpResponse<UserRoles[]> | any) => {
      this.userRoles = roles;
      this.dataSource = new MatTableDataSource<UserRoles>(this.userRoles);

      this.dataSource.data.forEach(row => {
        if (row.seleccionado) {
          //this.first = false;
          this.rolesOriginal.push(row.id);
          this.selection.select(row);
        } else {
          this.selection.deselect(row);
        }
      });

      //this.checkButton();
    });

    this.form = this.fb.group({
      id: [this.defaults.id]//,
      //seleccion: [false, { validators: [ Validators.requiredTrue ]}]
    });
  }

  isAllSelected() { // Devuelve verdadero si todos los elementos están seleccionados
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() { // Selecciona todas las filas si no están todas seleccionadas; de lo contrario, las deselecciona
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.checkButton();
  }

  checkboxLabel(row?: UserRoles): string { // Modifica la etiqueta del checkbok recibido
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  changeEvent(row: UserRoles) { // Evento check de los roles
    this.selection.toggle(row);
    this.checkButton();
  }

  updateUserRoles() {
    this.botonDesactivado = true;

    /*this.rolesSeleccionados = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.rolesSeleccionados.push(row.id);
      }
    });*/

    //if (this.rolesCompare2(this.rolesSeleccionados, this.rolesOriginal).length > 0) { // Si el usuario no modificó el formulario, no enviamos la solicitud al servidor
      this.rolesService.updateUserRoles(this.defaults.id, this.rolesSeleccionados).subscribe(() => {
        this.botonDesactivado = false;
        //this.errorType = false;
        //this.errores = ['Información actualizada correctamente!'];
        this.dialogRef.close(this.defaults);
      }, (error: any) => {
        this.botonDesactivado = false;
        //this.errorType = true;
        this.errores = ['Ocurrio un error, intente nuevamente!'];
      });
    //} else this.botonDesactivado = false;
  }

  checkButton() { // Verificamos si estan todos seleccionados o no para habilitar el boton
    this.rolesSeleccionados = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.rolesSeleccionados.push(row.id);
      }
    });

    if (this.rolesCompare(this.rolesSeleccionados, this.rolesOriginal).length > 0) { // La información fue modificada
      this.botonDesactivado = false;
    } else { // La información no fue modificada
      this.botonDesactivado = true;
    }

    /*this.botonDesactivado = false;

    if (this.first) {
      let select = false;
      this.dataSource.data.forEach(row => { if (this.selection.isSelected(row)) select = true; });

      if (select) {
        this.form.controls['seleccion'].setValue(true);
        this.botonDesactivado = false;
      } else {
        this.form.controls['seleccion'].setValue(false);
        this.botonDesactivado = true;
      }
    } else this.form.controls['seleccion'].setValue(true);*/
  }

  /*rolesCompare(array1: string[], array2: string[]) {
    var is_same = (array1.length == array2.length) && array1.every(function(element, index) {
      return element === array2[index];
    });
  }*/

  cancel(event: any) {
    event.preventDefault();
    this.dialogRef.close();
  }

  rolesCompare(a1: string[], a2: string[]) {
    var a: string[] = [], diff: string[] = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
  }
}
