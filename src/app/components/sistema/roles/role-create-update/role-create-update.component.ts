import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateUpdateRoleDTO, RoleDTO } from 'src/app/models/seguridad/roles/role.model';
import { CatalogosService } from 'src/app/services/common/catalogos.service';
import { RolesService } from 'src/app/services/seguridad/roles/roles.service';
import { parsearErroresAPI } from 'src/app/utils/utils';

@Component({
  selector: 'senap-role-create-update',
  templateUrl: './role-create-update.component.html',
  styleUrls: ['./role-create-update.component.scss']
})
export class RoleCreateUpdateComponent implements OnInit {

  form: FormGroup | any;
  mode: 'create' | 'update' = 'create';
  errores: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: RoleDTO,
              private dialogRef: MatDialogRef<RoleCreateUpdateComponent>,
              private fb: FormBuilder,
              private catalogosService:CatalogosService,
              private rolesService: RolesService) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as RoleDTO;
    }

    this.form = this.fb.group({
      id: [this.defaults.id],
      name: [this.defaults.name || '', { validators: [ Validators.required ]}],
      descripcion: [this.defaults.descripcion || '', { validators: [ Validators.required ] }]
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createUser();
    } else if (this.mode === 'update') {
      this.updateUser();
    }
  }

  /*createCustomer() {
    const customer = this.form.value;
    this.dialogRef.close(customer);
  }*/

  createUser() {
    const roleDTO = this.form.value;
    const createUpdateRoleDTO = new CreateUpdateRoleDTO(roleDTO);

    // Create user in backend
    this.rolesService.createRole(createUpdateRoleDTO).subscribe(() => {
      this.dialogRef.close(roleDTO);
    }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);
  }

  /*updateCustomer() {
    const customer = this.form.value;
    customer.id = this.defaults.id;

    this.dialogRef.close(customer);
  }*/

  updateUser() {
    const roleDTO = this.form.value;
    roleDTO.id = this.defaults.id;
    const createUpdateRoleDTO = new CreateUpdateRoleDTO(roleDTO);

    // Update user in backend
    this.rolesService.updateRole(roleDTO.id, createUpdateRoleDTO).subscribe(() => {
      this.dialogRef.close(roleDTO);
    }, (error: any) => this.errores = ['Ocurrio un error, intente nuevamente!']);
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
