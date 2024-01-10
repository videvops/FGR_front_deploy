import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageUserViewModel } from 'src/app/models/seguridad/usuarios/manage-user.model';
import { UserAvatar } from 'src/app/models/seguridad/usuarios/user-avatar.model';
import { UserSIC } from 'src/app/models/seguridad/usuarios/UserSIC';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiURL = environment.apiURL + 'api/accounts';
 // private prometheusApi = environmentPrometheusApi.apiURL + 'api/SL_Catalogos';

  constructor(private _http: HttpClient) { }

  public getUsers(pagina: number, cantidadRegistrosAMostrar: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
    return this._http.get<UserDTO[]>(this.apiURL, { observe: 'response', params });
  }

  public getUser(id: string): Observable<UserDTO> {
    return this._http.get<UserDTO>(`${this.apiURL}/user/${id}`);
  }

  public createUser(user: CreateUserDTO) {
    return this._http.post(`${this.apiURL}/register`, user);
  }

  public updateUser(id: string, user: UpdateUserDTO) {
    return this._http.put(`${this.apiURL}/update/${id}`, user);
  }

  public updatePassword(id: string, model: ManageUserViewModel) {
    return this._http.put(`${this.apiURL}/updatePassword/${id}`, model);
  }

  // No implementado
  public deleteUser(id: string) {
    return this._http.delete(`${this.apiURL}/delete/${id}`);
  }

  public saveAvatar(avatar: UserAvatar) {

    const formData = this.avatarFormData(avatar);
    return this._http.post(`${this.apiURL}/avatar`, formData);
  }

  private avatarFormData(avatar: UserAvatar): FormData {
    const formData = new FormData();
    formData.append('catFiscaliaID', avatar.catFiscaliaID.toString());
    formData.append('avatar', avatar.avatar);
    return formData;
  }

  // public UserSIC (value: string){
  //   return this._http.get<UserSIC>(`${this.apiURL}/BuscarPersonal/${value}`);
  // }

 
}
