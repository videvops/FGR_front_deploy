import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarDirective } from '../../@fury/shared/sidebar/sidebar.directive';
import { SidenavService } from './sidenav/sidenav.service';
import { filter, map, startWith } from 'rxjs/operators';
import { ThemeService } from '../../@fury/services/theme.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../../@fury/utils/check-router-childs-data';
import { HttpResponse } from '@angular/common/http';
import { SidenavItem } from './sidenav/sidenav-item/sidenav-item.interface';
import { of } from 'rxjs';
import { MenuService } from '../services/seguridad/menu/menu.service';

@Component({
  selector: 'fury-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [SidenavService]
})
export class LayoutComponent implements OnInit, OnDestroy {

  @ViewChild('configPanel', { static: true }) configPanel: SidebarDirective | any;

  sidenavOpen$ = this.sidenavService.open$;
  sidenavMode$ = this.sidenavService.mode$;
  sidenavCollapsed$ = this.sidenavService.collapsed$;
  sidenavExpanded$ = this.sidenavService.expanded$;
  quickPanelOpen: boolean = false;

  sideNavigation$ = this.themeService.config$.pipe(map(config => config.navigation === 'side'));
  topNavigation$ = this.themeService.config$.pipe(map(config => config.navigation === 'top'));
  toolbarVisible$ = this.themeService.config$.pipe(map(config => config.toolbarVisible));
  toolbarPosition$ = this.themeService.config$.pipe(map(config => config.toolbarPosition));
  footerPosition$ = this.themeService.config$.pipe(map(config => config.footerPosition));

  scrollDisabled$ = this.router.events.pipe(
    //filter<NavigationEnd>(event => event instanceof NavigationEnd),
    filter((event: any): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.scrollDisabled))
  );

  constructor(private sidenavService: SidenavService,
              private themeService: ThemeService,
              private route: ActivatedRoute,
              private router: Router,
              private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe((httpResponse: HttpResponse<SidenavItem[]> | any) => {
      of(httpResponse.map((item: any) => new SidenavItem(item))).subscribe((result: any) => {
        this.sidenavService.addItems(result);
      });
    });
  }

  openQuickPanel() {
    this.quickPanelOpen = true;
  }

  openConfigPanel() {
    this.configPanel.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  ngOnDestroy(): void { }
}

