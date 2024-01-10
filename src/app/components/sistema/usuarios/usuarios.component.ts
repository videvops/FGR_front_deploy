import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListColumn } from '../../../../@fury/shared/list/list-column.model';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';
import { UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { fadeInRightAnimation } from '../../../../@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../../../@fury/animations/fade-in-up.animation';
import { HttpResponse } from '@angular/common/http';
import { UsuariosService } from 'src/app/services/seguridad/usuarios/usuarios.service';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { ModalSeparoComponent } from '../separo/modal-sepraro/modal-separo/modal-separo.component';
import { inicializarPaginador } from 'src/app/utils/utils';

@Component({
  selector: 'senap-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  cantidadTotalRegistros: number | null | undefined;
  paginaActual = 1;
  pageSize = 10;

  dataSource: MatTableDataSource<UserDTO> | any;

  subject$: ReplaySubject<UserDTO[]> = new ReplaySubject<UserDTO[]>(1);
  data$: Observable<UserDTO[]> = this.subject$.asObservable();
  users: UserDTO[] = [];
  @ViewChild(MatSort, { static: true }) ordenamiento: MatSort | any;
  @ViewChild('paginator') paginador!: MatPaginator;

  @Input()
  columns: ListColumn[] = [
    { name: 'Checkbox', property: 'checkbox', visible: false },
    { name: 'Image', property: 'image', visible: true },

    { name: 'Usuario ID', property: 'userId', visible: true, isModelProperty: true },
    { name: 'Usuario', property: 'normalizedUserName', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email', visible: true, isModelProperty: true },
    { name: 'Nombre Corto', property: 'friendlyName', visible: true, isModelProperty: true },
    { name: 'Fecha Alta', property: 'alta', visible: true, isModelProperty: true },
    { name: 'Status Cuenta', property: 'status', visible: true, isModelProperty: false },
    { name: 'Actions', property: 'actions', visible: true },
  ] as ListColumn[];

  constructor(private dialog: MatDialog, private usuariosService: UsuariosService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getUsers(pagina: number, tamanioRegistros: number) {
    this.usuariosService.getUsers(this.paginaActual, this.pageSize).subscribe((usuarios: HttpResponse<UserDTO[]> | any) => {
      of(usuarios.body.map((usuario: any) => new UserDTO(usuario))).subscribe(result => {
        this.subject$.next(result);
      });

      this.cantidadTotalRegistros = usuarios.headers.get("cantidadTotalRegistros"); 
      this.dataSource.sort = this.ordenamiento;
      if (Object.keys(usuarios.body).length == 0 && this.paginaActual > 1) {
        this.paginador.pageIndex--;
        this.paginaActual--;
      }
    });
  }

  ngOnInit() {
    this.getUsers(this.paginaActual, this.pageSize);
    

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((users) => {
      this.users = users;
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    inicializarPaginador(this.paginador);
  }

  createCustomer() {
    this.dialog.open(UserCreateUpdateComponent).afterClosed().subscribe((user: UserDTO) => {
      // Customer is the updated customer (if the user pressed Save - otherwise it's null)
      if (user) {
        this.getUsers(this.paginaActual, this.pageSize);
        //this.users.unshift(new UserDTO(user));
        //this.subject$.next(this.users);
      }
    });
  }

  updateUser(user: UserDTO) {
    this.dialog.open(UserCreateUpdateComponent, {
      width: '700px',
      data: user
    }).afterClosed().subscribe((user) => {
      // user is the updated UsersDTO (if the user pressed Save - otherwise it's null)
      if (user) {
        this.usuariosService.getUser(user.id).subscribe(userDTO => {
          const index = this.users.findIndex((existingUser) => existingUser.id === user.id);
          this.users[index] = new UserDTO(userDTO);
          this.subject$.next(this.users);
        }, (error: any) => console.log(error));
      }
    });
  }

  updateUserRoles(user: UserDTO) {
    this.dialog.open(UserRolesComponent, {
      width: '800px',
      data: user
    }).afterClosed().subscribe((userRoles?: UserDTO) => {
      // user is the updated UsersDTO (if the user pressed Save - otherwise it's null)
      if (userRoles) {
        this.usuariosService.getUser(user.id).subscribe(userDTO => {
          const index = this.users.findIndex((existingUser) => existingUser.id === user.id);
          this.users[index] = new UserDTO(userDTO);
          this.subject$.next(this.users);
        }, (error: any) => console.log(error));
      }
    });
  }

  onFilterChange(value: any) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }


  asiganarSeparo(user: UserDTO){
  this.dialog.open(ModalSeparoComponent,{
    // disableClose: true,
        width: '450px',
        height: '800px',
        data: {user},
  })
  .beforeClosed()
  .subscribe((resultado)=>{
    if(resultado == null){

    }
  });
  (error) => console.error(error)
  }

    //Actualzacion de la Paginacion 
    actualizarPaginacion(datos: PageEvent) {
      this.paginaActual = datos.pageIndex + 1;
      this.pageSize = datos.pageSize;
      this.getUsers(this.paginaActual, this.pageSize);
    }

  ngOnDestroy() {
  }

}
