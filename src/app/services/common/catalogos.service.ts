import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatStatusAccountDTO } from 'src/app/models/seguridad/usuarios/status-account.model';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  constructor(private http: HttpClient) { } 

  // private apiURL=environment.apiURL+'catalogos/catRangoIngreso';
  private apiURL = environment.apiURL + 'api/catalogos';


   // Seguridad
   public getStatusAccount(): Observable<any>{
    return this.http.get<CatStatusAccountDTO[]>(this.apiURL + '/catStatusAccount', {observe: 'response'});
  }

  //CatAutoridadCargoDetencion
  public getCatAutoridadCargoDetencion(): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/catAutoridadCargoDetencion', {observe: 'response'});
  }
  //catNacionalidad
  public getCatNacionalidad(): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/catNacionalidad', {observe: 'response'});
  }

    //catDelito
    public getCatDelito(): Observable<any>{
      return this.http.get<[]>(this.apiURL + '/catDelito', {observe: 'response'});
    }
  
    //catMotivoEgreso
    public getCatoMotivoEgreso(): Observable<any>{
      return this.http.get<[]>(this.apiURL + '/catMotivoEgreso', {observe: 'response'});
    }

       //catSeparos
       public getSeparos(): Observable<any>{
        return this.http.get<[]>(this.apiURL + '/catSeparo', {observe: 'response'});
      }

      
       //arbol separos
       public getArbolSeparos(): Observable<any>{
        return this.http.get<[]>(this.apiURL + '/catArbolSeparos', {observe: 'response'});
      }

        //catEntidadFederativa
  public getCatEntidadFederativa(): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/getEntidadFedSeparos', {observe: 'response'});
  }
       

  //catSede/Subsede
  public getSedeSubsede(id:number): Observable<any>{
    // const urlGet = this.apiURL + '/getSedesSubsedesSeparos/'+id;
    return this.http.get<[]>(this.apiURL + '/getSedesSubsedesSeparos/'+id, {observe: 'response'});
    // return this.http.get(urlGet);
  }

   //catSeparo por sede
  public getCatSeparo(id:number): Observable<any>{
    // const urlGet = this.apiURL + '/getCatSeparos/'+id;
    return this.http.get<[]>(this.apiURL + '/getCatSeparos/'+id, {observe: 'response'});
    // return this.http.get(urlGet);
  }


  // Usuarios en el SIC
  public UserSIC (value : string): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/getCatUsuariosAIC/'+value);
  }


//Agregado por Gustavo Diego
   //CatDelitoPFM
   public getCatDelitoPFM(): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/getPFMCatDelito', {observe: 'response'});
  }
//CatClasificacionDelitoPFM
  public getCatClasificacionDelitoPFM(id:number): Observable<any>{
    return this.http.get<[]>(this.apiURL + '/getCatDelitoModalidad/'+id, {observe: 'response'});
  }

}
