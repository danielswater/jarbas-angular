import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CadastroUsuario } from './interface/CadastroUsuario.interface';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isApiLoaded = false;

  options: any = {
    componentRestrictions: { country: 'BR',  }
  }  

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

  constructor(private service: UsuariosService, private spinner: NgxSpinnerService, private mapsAPILoader: MapsAPILoader){}

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() =>{
      this.isApiLoaded = true
    })
  }

  handleAddressChange(address: Address) {
    // this.modelCadastrUsuario.numero = address.address_components[0].short_name
    // console.log(address.address_components[0].short_name)
    console.log(address)
    console.log(address.formatted_address)
    console.log(address.geometry.location.lat())
    console.log(address.geometry.location.lng())
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
