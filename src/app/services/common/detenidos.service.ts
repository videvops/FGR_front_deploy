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
export class DetenidosService {

  private detenidosCache: Detenidos[] = [];

  constructor(private http: HttpClient) { }

  private apiURL = environment.apiURL + 'api/Detenidos';

  private asuntoUsuario = new Subject<UserDTO>();

  getCacheInicial() {
    
    return this.detenidosCache;
  }
  
  public insertDetenido(createDetenido : DetenidosDTO_Net): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    
    const formulario = JSON.stringify(createDetenido);
    return this.http.post<Detenidos>(this.apiURL, formulario,{headers:headers}).pipe(map(response => {
      if (response) { 
          this.detenidosCache.unshift(response);
          return response;//Primer registro creado
     
     
      } 
      return response;
    }));    
  }


  getDetenidos(pagina: number, cantidadRegistrosAMostrar: number){
  
    // if (this.detenidosCache.length > 0) 
    // {
    //   return of(this.detenidosCache);
    // }
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

  getDetenidosBuscador(buscador:formBuscadorDetenidos ,pagina: number, cantidadRegistrosAMostrar: number) {
    
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'});
          // const formulario = JSON.stringify(buscador);
          const formData = construirFormData(buscador);
          let params = new HttpParams();
          params = params.append('pagina', pagina.toString());
          params = params.append('recordsPorPagina', cantidadRegistrosAMostrar.toString());
         
       return this.http.post<formBuscadorDetenidos | any>(this.apiURL+"/Buscador",formData, {observe: 'response', params});
       
     }

  modeloDetenido(detenidoId: string): Observable<any>{
    const urlGet = this.apiURL + '/GetModeloDetenido/'+detenidoId;
    return this.http.get(urlGet);
  }

     //catEntidadFederativa por usuario
     public getCatEntidadFederativaUser(): Observable<any>{
      return this.http.get<[]>(this.apiURL + '/getEntidadesSeparosUser', {observe: 'response'});
    }
    
    public editarDetenido(id:string,formDetenido: DetenidosDTO) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      const formulario = JSON.stringify(formDetenido);
      return this.http.put(this.apiURL +'/'+ id, formulario,{headers:headers}).pipe(map(response => {
       
          if(this.detenidosCache.some(recorre => {
          
            if(recorre.id === id)
            {
              return true;
            }
            return false;
          })) return 1;
            
        return 0;
      }));; 
    }


  eliminarDetenido(id:string): Observable<any>{
    return this.http.delete(this.apiURL+"/"+id)
  }


  public insertEgreso(id: string,creaEgreso : formEgreso): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
    
    const formulario = JSON.stringify(creaEgreso);
    return this.http.post<Detenidos>(this.apiURL+"/AgregarEgreso/"+id, formulario,{headers:headers}).pipe(map(response => {
      
      if (response) { 
        this.detenidosCache.unshift(response);
        return response;//Primer registro creado
   
   
    } 
      return response;
    }));    
  }

  public editEgreso(id: string,creaEgreso : formEgreso): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
  
    
    const formulario = JSON.stringify(creaEgreso);
    return this.http.put<Detenidos>(this.apiURL+"/updateEgreso/"+id, formulario,{headers:headers}).pipe(map(response => {

      if(this.detenidosCache.some(recorre => {
        console.log(response);
        if(recorre.id === id)
        {
          return true;
        }
        return false;
      })) return 1;
        
    return 0;
    }));    
  }

  modeloEgreso(detenidoId: string): Observable<any>{
    const urlGet = this.apiURL + '/GetModeloEgreso/'+detenidoId;
    return this.http.get(urlGet);
  }


  insertSeparoUsuario(id:string,listaSeparos:number[]) {
 
        
          
          const formData = new FormData();
          let params = new HttpParams();

          params = params.append('id', id.toString());
          formData.append("ubicacionesSedesIn", listaSeparos.toString());

          
          return this.http.post<any>(this.apiURL+"/agregarUbicacionesSeparos",formData,{observe: 'response', params});
         
      //  return this.http.post<any>(this.apiURL+"/AgregarUbicacionesSeparos", {observe: 'response', params});
       
     }

     modeloEntidadSedeSeparo(id: string): Observable<any>{
      let params = new HttpParams();

      params = params.append('id', id.toString());
      // const urlGet = this.apiURL + '/getEntidadesSeparosUserActuales/',{observe: 'response', params};
      return this.http.get(this.apiURL + '/getEntidadesSeparosUserActuales/',{ observe: 'response', params });
    }

    editSeparoUsuario(id:string,listaSeparos:number[]) {
 
        
          
      const formData = new FormData();
      let params = new HttpParams();

      params = params.append('id', id.toString());
      formData.append("ubicacionesSedesIn", listaSeparos.toString());

      
      return this.http.put<any>(this.apiURL+"/updateUbicacionesSeparos",formData,{observe: 'response', params});
     
  //  return this.http.post<any>(this.apiURL+"/AgregarUbicacionesSeparos", {observe: 'response', params});
   
 }


    //Servicios para el arbol de ubicaciones
    public obtenerDatosUsuario() {
      return this.asuntoUsuario.asObservable();
    }

    public establecerDatosUsuario(usuario: UserDTO) {
      this.asuntoUsuario.next(usuario);
    }


  
  

  }
  


