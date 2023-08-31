import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlAccesoService {
  url_usuarios            = `${environment.base_url}/user`;
  url_usuarios_catalogos  = `${environment.base_url}/user-catalogs`;
  constructor(private http: HttpClient) { }


}
