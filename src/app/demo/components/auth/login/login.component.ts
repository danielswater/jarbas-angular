import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from './service/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  email: string;
  senha: string;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  signIn(): void {
    this.spinner.show()
    this.authService
      .login(this.email, this.senha)
      .then((response) => {
        // Sucesso no login
        console.log(response);
        console.log('Usuário autenticado com sucesso!');
        this.spinner.hide()
        this.router.navigateByUrl('/admin'); // Redirecionar para a rota "admin"
      })
      .catch((error) => {
        // Erro no login
        this.spinner.hide()
        Swal.fire('Erro', `Nenhum usuário encontrado!`, 'error');
        console.error('Erro ao autenticar usuário:', error);
      });
  }
}
