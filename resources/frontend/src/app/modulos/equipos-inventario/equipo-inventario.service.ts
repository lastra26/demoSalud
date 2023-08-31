import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipoInventarioService {
  url_equipo_inventario  = `${environment.base_url}/equipo-inventario`;
  url_catalogos          = `${environment.base_url}/catalogs`;
  constructor(private http: HttpClient) { }


  guardarEqiupoInventario(payload:any):Observable<any> {
    return this.http.post<any>(this.url_equipo_inventario, payload).pipe(
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


}
