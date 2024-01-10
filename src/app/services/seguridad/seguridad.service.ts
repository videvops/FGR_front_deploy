import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonWebToken, userCredentials } from 'src/app/models/seguridad/seguridad';
import { convertirAUTF8 } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  apiURL = environment.apiURL + 'api/accounts';
  private readonly keyToken = 'token';
  private readonly keyExpiration = 'token-expiration';
  private readonly sessionId = 'sessionid';

  constructor(private httpClient: HttpClient) { }

  estaLogueado(): boolean {
    const token = localStorage.getItem(this.keyToken);
    if (!token) {
      return false;
    }

    const expiration = localStorage.getItem(this.keyExpiration);
    if (!expiration) {
      return false;
    } else {
      const dateExpiration = new Date(expiration);
      if (dateExpiration <= new Date()) {
        this.logout();
        return false;
      }
    }

    return true;
  }

  logout() {
    return this.httpClient.post(this.apiURL + '/logoff', { SessionID: this.getSessionID() });
  }

  cleanSession() {
    localStorage.removeItem(this.keyToken);
    localStorage.removeItem(this.keyExpiration);
  }

  getRoles(): string[] {
    let roles = this.obtenerCampoJWT("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
    if (typeof roles === 'string') {
      let arr: string[] = [];
      arr.push(roles);
      return arr;
    }
    return roles;
  }

  getUserId(): string {
    return this.obtenerCampoJWT("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
  }

  obtenerCampoJWT(campo: string) {
    const token = localStorage.getItem(this.keyToken);
    if (!token) {
      return '';
    }
    var dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[campo];
  }

  register(credentials: userCredentials): Observable<JsonWebToken> {
    return this.httpClient.post<JsonWebToken>(this.apiURL + '/register', credentials);
  }

  login(credentials: userCredentials): Observable<any> {
    return this.httpClient.post<JsonWebToken>(this.apiURL + '/login', credentials, { observe: 'response' });
  }

  guardarToken(authenticationResponse: JsonWebToken) {
    localStorage.setItem(this.keyToken, authenticationResponse.accessToken);
    localStorage.setItem(this.keyExpiration, authenticationResponse.expiration.toString());
    localStorage.setItem(this.sessionId, authenticationResponse.sessionID);
  }

  getToken() {
    return localStorage.getItem(this.keyToken);
  }

  getSessionID() {
    return localStorage.getItem(this.sessionId);
  }
}
