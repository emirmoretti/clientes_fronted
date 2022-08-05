import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  /*Atributos*/
  titulo: String = 'Titulo';

  cliente: Cliente = new Cliente();

  errores: string[];

  regiones: Region[];

  constructor(
    private clienteService: ClienteService
    , private router: Router
    , private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    })
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire({
          title: 'Nuevo cliente guardado!',
          text: `${json.mensaje} ${json.cliente.nombre} creado`,
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('codigo del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire({
          title: 'Cliente actualizado',
          text: `Cliente ${json.cliente.nombre} actualizado`,
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('codigo del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }
  compararRegion(o1: Region, o2: Region): boolean {

    if (o1 === undefined && o2 === undefined) {
      return true;
    }

    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false : o1.id === o2.id;
  }
}
