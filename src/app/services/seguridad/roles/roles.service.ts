import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsDTO } from 'src/app/models/seguridad/roles/product-roles.model';
import { CreateUpdateRoleDTO, RoleDTO } from 'src/app/models/seguridad/roles/role.model';
import { UserRoles } from 'src/app/models/seguridad/roles/user-roles.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiURL = environment.apiURL + 'api/roles';

  constructor(private _http: HttpClient) { }

  public getRoles(pagina: number, cantidadRegistrosAMostrar: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    return this._http.get<RoleDTO[]>(this.apiURL, { observe: 'response', params });
  }

  public getRole(id: string): Observable<RoleDTO> {
    return this._http.get<RoleDTO>(`${this.apiURL}/role/${id}`);
  }

  public getUserRoles(id: string): Observable<any> {
    return this._http.get<UserRoles[]>(`${this.apiURL}/userRoles/${id}`);
  }

  public getProductRoles(id: string, menuId: number): Observable<any> {
    return this._http.get<ProductsDTO[]>(`${this.apiURL}/productRoles/${id}/${menuId}`);
  }

  public createRole(role: CreateUpdateRoleDTO) {
    return this._http.post(`${this.apiURL}/create`, role);
  }

  public updateRole(id: string, role: CreateUpdateRoleDTO) {
    return this._http.put(`${this.apiURL}/update/${id}`, role);
  }

  public updateUserRoles(id: string, roles: string[]) {
    return this._http.put(`${this.apiURL}/updateUserRoles/${id}`, roles);
  }

  public updateProductRoles(id: string, mid: number, products: number[]) {
    return this._http.put(`${this.apiURL}/updateProductRoles/${id}/${mid}`, products);
  }

  // No implementado
  public deleteRole(id: string) {
    return this._http.delete(`${this.apiURL}/delete/${id}`);
  }
}
