import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  url_usuarios            = `${environment.base_url}/user`;
  url_usuarios_catalogos  = `${environment.base_url}/user-catalogs`;
  url_catalogos          = `${environment.base_url}/catalogs`;
  url_grupo_unidades      = `${environment.base_url}/grupo-cargar-unidades`; 
  url_change_status       = `${environment.base_url}/change-user-status/`; 

  constructor(private http: HttpClient) { }
  
  obtenerUsuarios(payload):Observable<any> {
    return this.http.get<any>(this.url_usuarios, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verUsuario(id):Observable<any> {
    return this.http.get<any>(this.url_usuarios + '/' + id, {}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarUsuario(payload:any):Observable<any> {
    return this.http.post<any>(this.url_usuarios, payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  cambiarStatus(id:number,payload:any):Observable<any>{
    return this.http.put<any>(this.url_change_status + id, payload);
}

  obtenerCatalogosUsuarios():Observable<any> {
    return this.http.get<any>(this.url_usuarios_catalogos,{}).pipe(
      map( response => {
        return response;
      })
    );
  }
  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  obtenerUnidadesGrupo(grupoId):Observable<any> {
    return this.http.get<any>(this.url_grupo_unidades + '/' + grupoId, {});
  }

  enviarCorreoRestaurar(payload:any):Observable<any> {
    const url = `${environment.base_url}/send-reset-password`;
    return this.http.post<any>(url, payload);
  }
}
