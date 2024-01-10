import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListColumn } from '../../../../@fury/shared/list/list-column.model';
import { EditPermisosPlantillasComponent } from './edit-permisos-plantillas/edit-permisos-plantillas.component';
import { fadeInRightAnimation } from '../../../../@fury/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../../../@fury/animations/fade-in-up.animation';
import { HttpResponse } from '@angular/common/http';
import { PlantillasPorFiscalia } from 'src/app/models/seguridad/plantillas-por-fiscalia/plantilla-fiscalia.model';
import { PermisoPlantillasService } from 'src/app/services/seguridad/plantillas/permiso-plantillas.service';

@Component({
  selector: 'senap-fiscalia-plantillas',
  templateUrl: './fiscalia-plantillas.component.html',
  styleUrls: ['./fiscalia-plantillas.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class FiscaliaPlantillasComponent implements OnInit, AfterViewInit, OnDestroy {
  paginaActual = 1;
  pageSize = 10;
  dataSource: MatTableDataSource<PlantillasPorFiscalia> | any;

  subject$: ReplaySubject<PlantillasPorFiscalia[]> = new ReplaySubject<PlantillasPorFiscalia[]>(1);
  data$: Observable<PlantillasPorFiscalia[]> = this.subject$.asObservable();
  fiscalias: PlantillasPorFiscalia[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  @Input()
  columns: ListColumn[] = [
    // { name: 'Checkbox', property: 'checkbox', visible: false },
    { name: 'Image', property: 'image', visible: true },

    { name: 'Fiscalía', property: 'nombreFiscalia', visible: true, isModelProperty: true },
    //{ name: 'Entidad Federativa', property: 'catEntidadFederativaID', visible: true, isModelProperty: true },
    { name: 'Mnemónico', property: 'mnemonico', visible: true, isModelProperty: true },
    { name: 'Latitud', property: 'latitud', visible: true, isModelProperty: true },
    { name: 'Longitud', property: 'longitud', visible: true, isModelProperty: true },
    { name: 'Plantillas permitidas', property: 'totalPlantillas', visible: true, isModelProperty: true },

    { name: 'Acciones', property: 'actions', visible: true },
  ] as ListColumn[];

  constructor(private dialog: MatDialog, private permisoPlantillasService: PermisoPlantillasService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getFiscalias() {
    this.permisoPlantillasService.getFiscalias().subscribe((catfis: HttpResponse<PlantillasPorFiscalia[]> | any) => {
      of(catfis.body.map((element: any) => new PlantillasPorFiscalia(element))).subscribe(result => {
        this.subject$.next(result);
      });
    });
  }

  ngOnInit() {
    this.getFiscalias();

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((fiscalias) => {
      this.fiscalias = fiscalias;
      this.dataSource.data = fiscalias;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  asignarPlantillas(fiscalia: PlantillasPorFiscalia) {
    this.dialog.open(EditPermisosPlantillasComponent, {
      width: '540px',
      height: '620px',
      data: fiscalia
    }).afterClosed().subscribe((result) => {
      // user is the updated UsersDTO (if the user pressed Save - otherwise it's null)
      if (result) {
        const index = this.fiscalias.findIndex((fiscalia) => fiscalia.catFiscaliaID === result.catFiscaliaID);
          this.fiscalias[index] = new PlantillasPorFiscalia(result);
          this.subject$.next(this.fiscalias);
      }
    });
  }

  /*createCustomer() {
    this.dialog.open(EditPermisosPlantillasComponent).afterClosed().subscribe((user: UserDTO) => {
      // Customer is the updated customer (if the user pressed Save - otherwise it's null)
      if (user) {
        this.getUsers();
        //this.users.unshift(new UserDTO(user));
        //this.subject$.next(this.users);
      }
    });
  }*/

  /*updateCustomer(user: UserDTO) {
    this.dialog.open(EditPermisosPlantillasComponent, {
      data: user
    }).afterClosed().subscribe((user) => {
      // user is the updated UsersDTO (if the user pressed Save - otherwise it's null)
      if (user) {
        / *this.usuariosService.getUser(user.id).subscribe(userDTO => {
          const index = this.users.findIndex((existingUser) => existingUser.id === user.id);
          this.users[index] = new UserDTO(userDTO);
          this.subject$.next(this.users);
        }, (error: any) => console.log(error));* /
      }
    });
  }*/

  /*deleteCustomer(user: UserDTO) {
    // Here we are updating our local array.
    // You would probably make an HTTP request here.
    //this.users.splice(this.users.findIndex((existingCustomer) => existingCustomer.id === user.id), 1);
    //this.subject$.next(this.users);
  }*/

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
