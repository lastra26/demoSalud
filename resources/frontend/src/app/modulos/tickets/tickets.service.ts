import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  url_tickets            = `${environment.base_url}/tickets`;
  url_first_seg          = `${environment.base_url}/ticket-seguimiento`;
  url_catalogos          = `${environment.base_url}/catalogs`;
  url_colaboradores      =  `${environment.base_url}/busqueda-colaborador`;

  url_seg_colaboradores  = `${environment.base_url}/seguimiento-colaboradores`;


  constructor(private http: HttpClient) { }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  obtenerTickets(payload):Observable<any> {
    return this.http.get<any>(this.url_tickets, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  verTicket(id):Observable<any> {
    return this.http.get<any>(this.url_tickets + '/' + id, {}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarTicket(payload:any):Observable<any> {
    return this.http.post<any>(this.url_tickets, payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  actualizarTicket(id,payload) {
    return this.http.put<any>(this.url_tickets+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }


  //seguimiento
  verSeguimiento(id):Observable<any> {
    return this.http.get<any>(this.url_first_seg + '/' + id, {}).pipe(
      map( response => {
        return response;
      })
    );
  }

  //seguimiento-colaborador

  asignarTicket(payload:any):Observable<any> {
    return this.http.post<any>(this.url_seg_colaboradores, payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerSeguimientosColaborador(payload):Observable<any> {
    return this.http.get<any>(this.url_seg_colaboradores, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }


}
