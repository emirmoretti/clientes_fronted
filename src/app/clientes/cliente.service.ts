import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, throwError, map } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    //console.log(token);
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout()
      }
      this.router.navigate(['/login'])
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning')
      this.router.navigate(['/clientes'])
      return true;
    }
    return false;
  }

  getClientes(page: number): Observable<any> {
    //return of(clientes);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.date = formatDate(cliente.date, 'EEEE dd/MMMM/yyyy', 'es-ES');
          return cliente;
        });
        return response;
      })
    );
  }
  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e)
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        if (e.status == 400) {
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        Swal.fire(
          'Error al editar',
          e.error.mensaje,
          'error'
        )
        return throwError(e);
      })
    )
  }
  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo); // "archivo" mismo nombre q pusismos en el backend
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });


    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );;
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
