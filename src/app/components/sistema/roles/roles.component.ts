import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListColumn } from '../../../../@fury/shared/list/list-column.model';
import { RoleCreateUpdateComponent } from './role-create-update/role-create-update.component';
import { fadeInRightAnimation } from '../../../../@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../../../@fury/animations/fade-in-up.animation';
import { HttpResponse } from '@angular/common/http';
import { RolesService } from 'src/app/services/seguridad/roles/roles.service';
import { RoleDTO } from 'src/app/models/seguridad/roles/role.model';
import { AsignaRolesProductosComponent } from './asigna-roles-productos/asigna-roles-productos.component';

@Component({
  selector: 'senap-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class RolesComponent implements OnInit, AfterViewInit, OnDestroy {
  paginaActual = 1;
  pageSize = 10;
  dataSource: MatTableDataSource<RoleDTO> | any;

  subject$: ReplaySubject<RoleDTO[]> = new ReplaySubject<RoleDTO[]>(1);
  data$: Observable<RoleDTO[]> = this.subject$.asObservable();
  roles: RoleDTO[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  @Input()
  columns: ListColumn[] = [
    { name: 'Rol', property: 'name', visible: true, isModelProperty: true },
    { name: 'Descripción', property: 'descripcion', visible: true, isModelProperty: true },
    { name: 'Fecha Alta', property: 'alta', visible: true, isModelProperty: true },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];

  constructor(private dialog: MatDialog, private rolesService: RolesService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getRoles() {
    this.rolesService.getRoles(this.paginaActual, this.pageSize).subscribe((roles: HttpResponse<RoleDTO[]> | any) => {
      of(roles.body.map((rol: any) => new RoleDTO(rol))).subscribe(result => {
        this.subject$.next(result);
      });
    });
  }

  ngOnInit() {
    this.getRoles();

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((roles) => {
      this.roles = roles;
      this.dataSource.data = roles;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createRole() {
    this.dialog.open(RoleCreateUpdateComponent).afterClosed().subscribe((role?: RoleDTO) => {
      // Customer is the updated customer (if the user pressed Save - otherwise it's null)
      if (role) {
        this.getRoles();
        //this.users.unshift(new UserDTO(user));
        //this.subject$.next(this.users);
      }
    });
  }

  updateRole(role: RoleDTO) {
    this.dialog.open(RoleCreateUpdateComponent, {
      data: role
    }).afterClosed().subscribe((role?: RoleDTO) => {
      // user is the updated UsersDTO (if the user pressed Save - otherwise it's null)
      if (role) {
        this.rolesService.getRole(role.id).subscribe(roleDTO => {
          const index = this.roles.findIndex((existingUser) => existingUser.id === role.id);
          this.roles[index] = new RoleDTO(roleDTO);
          this.subject$.next(this.roles);
        }, (error: any) => console.log(error));
      }
    });
  }

  asignaProductos(role: RoleDTO) {
    this.dialog.open(AsignaRolesProductosComponent, {
      width: '640px',
      //height: '620px',
      data: role
    }).afterClosed().subscribe((result?: RoleDTO) => {
      if (result) {
        //console.log(result);
      }
    });
  }

  deleteRole(user: RoleDTO) {
    // Here we are updating our local array.
    // You would probably make an HTTP request here.
    //this.users.splice(this.users.findIndex((existingCustomer) => existingCustomer.id === user.id), 1);
    //this.subject$.next(this.users);
  }

  onFilterChange(value: any) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  ngOnDestroy() {
  }

}
