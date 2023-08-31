import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import { Observable, map } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InnerService {
  url_unidades = `${environment.base_url}/unidades`;
  url_buscador_catalogos = `${environment.base_url}/buscador-unidades-catalogos`;

  constructor(private http: HttpClient) { }

  buscar(payload):Observable<any> {
    return this.http.get<any>(this.url_unidades,{params:payload});
  }

  getCatalogos():Observable<any>{
    return this.http.get<any>(this.url_buscador_catalogos,{});
  }
}

@Component({
  standalone: true,
  selector: 'widget-buscador-unidades',
  templateUrl: './widget-buscador-unidades.component.html',
  styleUrls: ['./widget-buscador-unidades.component.css'],
  imports: [MaterialModule, CommonModule],
})
export class WidgetBuscadorUnidadesComponent implements OnInit {
  @Input() ctrlNoMostrarUnidades:any = {};

  @Output() unidadSeleccionada = new EventEmitter<any>();
  @Output() unidadesSeleccionadas = new EventEmitter<any>();

  constructor(
    private service: InnerService
  ){}

  isLoading:boolean;

  listaDistritos:any[];
  distritoSeleccionado:any;

  responseUnidades:any[];

  ngOnInit(){
    this.isLoading = true;
    this.listaDistritos = [];

    this.service.getCatalogos().subscribe({
      next:(response:any)=>{
        if(response.data.distritos){
          this.listaDistritos = response.data.distritos;
        }
        this.isLoading = false;
      },
      error:(response:any)=>{
        this.isLoading = false;
        console.log(response.error.message);
      }
    });
  }

  filtrarPorDistrito(distrito?:any){
    if(distrito){
      this.distritoSeleccionado = distrito;
    }else{
      this.distritoSeleccionado = undefined;
    }
  }

  seleccionarTodos(){
    this.unidadesSeleccionadas.emit(this.responseUnidades);
    this.responseUnidades = [];
  }

  seleccionar(unidad:any){
    if(unidad){
      this.unidadSeleccionada.emit(unidad);
      let index = this.responseUnidades.findIndex(item => item.id == unidad.id);
      if(index >= 0){
        this.responseUnidades.splice(index,1);
      }
    }
  }

  buscarUnidades(input){
    if(!this.isLoading){
      this.isLoading = true;
      this.responseUnidades = [];
      const query = (input as HTMLInputElement).value;
      
      let params:any = {};

      if(query){
        params.query = encodeURIComponent(query);
      }

      if(this.distritoSeleccionado){
        params.distrito_id = this.distritoSeleccionado.id;
      }

      this.service.buscar(params).subscribe({
        next:(response:any)=>{
          let lista_unidades:any[] = [];
          response.data.forEach(unidad => {
            if(!this.ctrlNoMostrarUnidades[unidad.id]){
              lista_unidades.push(unidad);
            }
          });
          this.responseUnidades = lista_unidades;
          this.isLoading = false;
        },
        error:(response:any)=>{
          console.log(response);
          this.isLoading = false;
        }
      }); 
    }
  }

  public limpiarBusqueda(){
    this.responseUnidades = [];
  }
}
