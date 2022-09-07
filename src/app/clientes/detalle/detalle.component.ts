import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = 'Detalles del cliente'
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService, public authService: AuthService) { }

  ngOnInit(): void {
  }

  seleccionarFoto($event) {

    console.log(this.fotoSeleccionada);
    this.fotoSeleccionada = $event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('error seleccionar imagen: ', 'el archivo debe ser del tipo imagen', 'error')
      this.fotoSeleccionada = null;
    }
  }

  enviarFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire(
        'Error debe seleccionar una foto', "", "error"
      )
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            
            Swal.fire(
              'Foto subida!',
              `Foto: ${this.cliente.foto}`,
              'success'
            )
          }
        })
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
