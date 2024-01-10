import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Detenidos, DetenidosDTO, DetenidosDTO_Net } from 'src/app/models/detenidos/detenidos';
import { formBuscadorDetenidos } from 'src/app/models/detenidos/formBuscador';
import { formEgreso } from 'src/app/models/detenidos/formEgreso';
import { UserDTO } from 'src/app/models/seguridad/usuarios/usuario.model';
import { construirFormData } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })

  export class GestionCenapiService {

    private detenidosCache: Detenidos[] = [];

    constructor(private http: HttpClient) { }
  
    private apiURL = environment.apiURL + 'api/GestionCenapi';
  
    private asuntoUsuario = new Subject<UserDTO>();

    getCacheInicial() {
    
        return this.detenidosCache;
      }

      getDetenidosCenapi(pagina: number, cantidadRegistrosAMostrar: number){
  
        
        let params = new HttpParams();
        params = params.append('pagina', pagina.toString());
        params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
        // return this.http.get(this.apiURL,{ observe: 'response', params });
    
        return this.http.get<Detenidos | any>(this.apiURL,{ observe: 'response', params }).pipe(map(response => {
          if (response) {
            this.detenidosCache = response.body;
          }
          return response;
        }));
      }

      modeloDetenido(detenidoId: string): Observable<any>{
        const urlGet = this.apiURL + '/GetModeloDetenido/'+detenidoId;
        return this.http.get(urlGet);
      }

      uploadFile(id:number,file:any) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
      });
      var body = new FormData();
      body.append("id",id.toString());
      body.append("archivo",file,file.name);
        return this.http.post<any>(this.apiURL+"/agregarFicha" ,body);
       }

       
  //Ver Ficha
  verFicha(id:string, nombreUnico:string){
  
    let params = new HttpParams();
        params = params.append('id', id.toString());
        params = params.append('nombreUnico', nombreUnico.toString());
    return this.http.get(this.apiURL+"/verArchivo",{ observe: 'response', params })
    // return this.http.get(this.apiURL+"/verArchivo",{ responseType: 'blob',params });
  
    // { responseType: 'blob'});
  }

  }