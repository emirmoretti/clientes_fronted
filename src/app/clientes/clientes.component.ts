import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService  
      ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    }
    );
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli != cliente)
            Swal.fire(
              'Cliente eliminado!',
              'Your file has been deleted.',
              'success'
            )
          }
        )
      }
    })

  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
