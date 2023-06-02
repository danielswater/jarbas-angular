import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from './../demo/components/auth/login/service/auth.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UsuariosService } from './../site/home/service/usuarios.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit {

  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;

    items!: MenuItem[];

    showNotifications: boolean = true;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private authService: AuthService, private service: UsuariosService) { }

    ngOnInit(): void {
      this.service.getContadorUsuarios().subscribe(data => {
        console.log('data', data)
      })
    }

    toggleNotifications(): void {
      this.showNotifications = !this.showNotifications;
    }

    logout(){
      this.authService.logout()
    }
}
