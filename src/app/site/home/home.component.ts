import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  model = {
    nome: '',
    email: '',
    telefone: ''
  }

  loading: boolean = false;

  constructor(private service: UsuariosService, private spinner: NgxSpinnerService){}

  ngOnInit(): void {
    
  }

  salvar(){
    // this.spinner.show()
    this.loading = true;
    this.service.criarUsuario(this.model)
    .then((response) => {
      console.log(response)
      setTimeout(() => {
        this.loading = false
    }, 2000);
      // setTimeout(() => {
      //   this.spinner.hide()
      // }, 5000);
    })
    .catch((error) => {
      console.log('ERROR', error)
    })
  }
}
