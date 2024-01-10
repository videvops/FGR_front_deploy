import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemsMenuDTO } from 'src/app/models/seguridad/menu/items-menu.model';
import { ProductsDTO } from 'src/app/models/seguridad/roles/product-roles.model';
import { RoleDTO } from 'src/app/models/seguridad/roles/role.model';
import { MenuService } from 'src/app/services/seguridad/menu/menu.service';
import { RolesService } from 'src/app/services/seguridad/roles/roles.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'senap-asigna-roles-productos',
  templateUrl: './asigna-roles-productos.component.html',
  styleUrls: ['./asigna-roles-productos.component.scss']
})
export class AsignaRolesProductosComponent implements OnInit {

  formProductroles: FormGroup | any;
  botonDesactivado: boolean = true;
  errores: string[] = [];
  //first: boolean = true;
  //errorType:boolean = true;

  menus: ItemsMenuDTO[] = [];
  menuId: number | any;
  products: ProductsDTO[] = [];
  productsSelected: number[] = [];
  productsSelectedDB: number[] = [];

  displayedColumns: string[] = ['select', 'name', ];
  dataSource = new MatTableDataSource<ProductsDTO>();
  selection = new SelectionModel<ProductsDTO>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: RoleDTO,
              private dialogRef: MatDialogRef<AsignaRolesProductosComponent>,
              private fb: FormBuilder,
              private rolesService: RolesService,
              private menuService: MenuService) { }

  ngOnInit(): void {
    this.formProductroles = this.fb.group({
      id: [this.defaults.id],
      menuId: [0, { validators: [ Validators.required, Validators.minLength(1) ]}],
      selected: [false, { validators: [ Validators.requiredTrue ]}]
    });

    this.menuService.getItemsMenu().subscribe((response: HttpResponse<ItemsMenuDTO[]> | any) => {
      this.menus = response.body;
    });
  }

  save() {
    this.botonDesactivado = true;

    /*this.productsSelected = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.productsSelected.push(row.productID);
      }
    });*/

    //if (this.rolesCompare(this.productsSelected, this.productsSelectedDB).length > 0) { // Si el usuario no modificó el formulario, no enviamos la solicitud al servidor
      this.rolesService.updateProductRoles(this.defaults.id, this.menuId, this.productsSelected).subscribe(() => {
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

  select(menuId: number) { // Acciones al cambiar el menu
    this.products = [];
    this.productsSelectedDB = [];
    //this.first = true;

    if (menuId === undefined) {
      this.menuId = 0;
      this.dataSource = new MatTableDataSource<ProductsDTO>(this.products);
      this.selection = new SelectionModel<ProductsDTO>(true, []);
    } else {
      this.menuId = menuId;

      this.rolesService.getProductRoles(this.defaults.id, this.menuId).subscribe((response: HttpResponse<ProductsDTO[]> | any) => {
        this.products = response;
        this.dataSource = new MatTableDataSource<ProductsDTO>(this.products);
        this.selection = new SelectionModel<ProductsDTO>(true, []);

        this.dataSource.data.forEach(row => {
          if (row.selected) {
            //this.first = false;
            this.productsSelectedDB.push(row.productID);
            this.selection.select(row);
          } else {
            this.selection.deselect(row);
          }
        });

        //this.checkSelectedProducts();
      });
    }
  }

  isAllSelected() { // Devuelve verdadero si todos los elementos están seleccionados
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() { // Selecciona todas las filas si no están todas seleccionadas; de lo contrario, las deselecciona
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.checkSelectedProducts();
  }

  checkboxLabel(row?: ProductsDTO): string { // Modifica la etiqueta del checkbok recibido
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.productID}`;
  }

  changeEvent(row: ProductsDTO) { // Evento check de los productos
    this.selection.toggle(row);
    this.checkSelectedProducts();
  }

  checkSelectedProducts() { // Verificamos si todos los productos estan seleccionados para habilitar el boton de guardar
    this.productsSelected = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.productsSelected.push(row.productID);
      }
    });

    if (this.rolesCompare(this.productsSelected, this.productsSelectedDB).length > 0) { // La información fue modificada
      this.botonDesactivado = false;
    } else { // La información no fue modificada
      this.botonDesactivado = true;
    }

    /*this.botonDesactivado = false;

    if (this.first) {
      let select = false;
      this.dataSource.data.forEach(row => { if (this.selection.isSelected(row)) select = true; });

      if (select) {
        this.formProductroles.controls['selected'].setValue(true);
        this.botonDesactivado = false;
      }
      else {
        this.formProductroles.controls['selected'].setValue(false);
        this.botonDesactivado = true;
      }
    } else this.formProductroles.controls['selected'].setValue(true);*/
  }

  cancel(event: any) {
    event.preventDefault();
    this.dialogRef.close();
  }

  rolesCompare(a1: number[], a2: number[]) {
    var a: boolean[] = [], diff: string[] = [];

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
