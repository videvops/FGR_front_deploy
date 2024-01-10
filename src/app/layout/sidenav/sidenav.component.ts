import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav.service';
import { ThemeService } from '../../../@fury/services/theme.service';
import { SeguridadService } from 'src/app/services/seguridad/seguridad.service';
import { convertirAUTF8 } from 'src/app/utils/utils';

@Component({
  selector: 'fury-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  sidenavUserVisible$ = this.themeService.config$.pipe(map(config => config.sidenavUserVisible));

  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean = false;

  @Input()
  @HostBinding('class.expanded')
  expanded: boolean = false;

  items$: Observable<SidenavItem[]> | any;

  constructor(private router: Router,
              private sidenavService: SidenavService,
              private themeService: ThemeService,
              private seguridadService: SeguridadService) {
  }

  ngOnInit() {
    this.items$ = this.sidenavService.items$.pipe(
      map((items: SidenavItem[]) => this.sidenavService.sortRecursive(items, 'position'))
    );
  }

  toggleCollapsed() {
    this.sidenavService.toggleCollapsed();
  }

  @HostListener('mouseenter')
  @HostListener('touchenter')
  // onMouseEnter() {
  //   this.sidenavService.setExpanded(true);
  // }

  // @HostListener('mouseleave')
  // @HostListener('touchleave')
  // onMouseLeave() {
  //   this.sidenavService.setExpanded(false);
  // }

  ngOnDestroy() {
  }

  obtenerUTF8(dato: string):string {
    return convertirAUTF8(dato);
  }
}
