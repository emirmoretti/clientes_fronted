import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html' 
})

export class HeaderComponent {
    title: string = 'app angular - spring'

    constructor(public authService: AuthService, private router: Router){

    }
    logout():void {
        this.authService.logout();
        Swal.fire('Log out', 'cerro sesion con exito', 'info');
        this.router.navigate(['/clientes'])
    }
}