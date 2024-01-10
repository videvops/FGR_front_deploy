import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';

@Component({
  selector: 'fury-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {

  isOpen: boolean = false;

  constructor(public seguridadService: SeguridadService, private router: Router) { }

  ngOnInit() {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  mostrarConfiguracion() {
    this.router.navigate(['/user/settings']);
  }

  mostrarAyuda() {
    //
  }

  cerrarSesion() {
    this.seguridadService.logout().subscribe();
    this.seguridadService.cleanSession();
    this.router.navigate(['/login']);
  }
}
