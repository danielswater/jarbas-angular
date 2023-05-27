import { Component, OnInit, NgZone } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CadastroUsuario } from './interface/CadastroUsuario.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  modelCadastrUsuario: CadastroUsuario = {
    bairro: '',
    cep: '',
    cidade: '',
    complemento: '',
    cpf_cnpj: '',
    email: '',
    endereco: '',
    estado: '',
    nome_fantasia: '',
    nome_responsavel: '',
    numero: '',
    razao_social: '',
    senha: '',
    telefone_estabelecimento: '',
    telefone_responsavel: ''
  }

  loading: boolean = false;

  constructor(private service: UsuariosService, private spinner: NgxSpinnerService){}

  ngOnInit(): void {
    
  }

  salvar(){
    // this.spinner.show()
    this.loading = true;
    this.service.criarUsuario(this.modelCadastrUsuario)
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
