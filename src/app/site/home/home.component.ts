import { Component, OnInit } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private service: UsuariosService){}

  model = {
    nome: '',
    email: '',
    idade: ''
  }

  ngOnInit(): void {
    
  }

  salvar(){
    console.log('model', this.model)
    this.service.criarUsuario(this.model)
    .then((response) => {
      console.log('response', response.id)
    })
    .catch((error) => {
      console.log('ERROR', error)
    })
  }
}
