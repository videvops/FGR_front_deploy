import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';
import { ItemsMenuDTO } from 'src/app/models/seguridad/menu/items-menu.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiURL = environment.apiURL + 'api/menu';

  constructor(private httpClient: HttpClient) { }

  public getMenu(): Observable<any> {
    return this.httpClient.get<SidenavItem[]>(this.apiURL + "/items");
  }

  public getItemsMenu(): Observable<any> {
    return this.httpClient.get<ItemsMenuDTO[]>(this.apiURL + "/itemsMenu", {observe: 'response'});
  }
}
