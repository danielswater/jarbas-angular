import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CadastroUsuario } from './interface/CadastroUsuario.interface';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isApiLoaded = false;
  cidadeSelecionada: any;
  cidades: any[] = [];

  options: any = {
    componentRestrictions: { country: 'BR', }
  }

  radioCpfCnpj = "CNPJ"

  modelCadastroUsuario: CadastroUsuario = {
    bairro: '',
    cep: '',
    cidade: '',
    complemento: '',
    cpf_cnpj: '',
    email: '',
    logradouro: '',
    estado: 'SP',
    nome_fantasia: '',
    nome_responsavel: '',
    numero: '',
    razao_social: '',
    tipo_documento: 'CNPJ',
    telefone_estabelecimento: '',
    telefone_responsavel: '',
    geolocalizacao : new GeoPoint(0, 0),
  }

  loading: boolean = false;

  constructor
    (private service: UsuariosService,
      private spinner: NgxSpinnerService,
      private mapsAPILoader: MapsAPILoader,
      private httpClient: HttpClient
    ) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.isApiLoaded = true
    })
  }


  buscarCidades(event: any): void {
    const query = event.query;
    this.service.obterCidades('SP', query).subscribe((cidades: any[]) => {
      this.cidades = cidades;
    });
  }


  selecionarCidade(event: any): void {
    this.modelCadastroUsuario.cidade = event.value
    console.log(this.modelCadastroUsuario)
  }

  handleAddressChange(address: Address) {
    const streetName = this.extractStreetName(address);
    this.modelCadastroUsuario.logradouro = streetName
    const neighborhood = this.extractNeighborhood(address);
    this.modelCadastroUsuario.bairro = neighborhood
    this.getCEP(address);
  }

  getCEP(address: Address): void {
    const geocoder = new google.maps.Geocoder();
    const geocodingOptions = {
      address: address.formatted_address
    };
  
    geocoder.geocode(geocodingOptions, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const cepComponent = results[0].address_components.find((component: any) =>
          component.types.includes('postal_code')
        );
  
        const cep = cepComponent ? cepComponent.long_name : '';
        this.modelCadastroUsuario.cep = cep;
      }
    });
  }

  salvar(){
    const endereco = `${this.modelCadastroUsuario.logradouro}, ${this.modelCadastroUsuario.numero} - ${this.modelCadastroUsuario.bairro}, ${this.modelCadastroUsuario.cidade} - SP, ${this.modelCadastroUsuario.cep}, Brasil`;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: endereco }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();
  
        const geopoint = new GeoPoint(latitude, longitude);
        this.modelCadastroUsuario.geolocalizacao = geopoint;
  
        this.loading = true;
        this.service.criarUsuario(this.modelCadastroUsuario)
          .then((response) => {
            console.log(response)
            this.loading = false;
          })
          .catch((error) => {
            console.log('ERROR', error)
          });
      }
    });
  }


  extractStreetName(address: Address): string {
    const routeComponent = address.address_components.find(component =>
      component.types.includes('route')
    );

    return routeComponent ? routeComponent.long_name : '';
  }

  extractNeighborhood(address: Address): string {
    const neighborhoodComponent = address.address_components.find(component =>
      component.types.includes('sublocality') || component.types.includes('neighborhood')
    );

    return neighborhoodComponent ? neighborhoodComponent.long_name : '';
  }

  tipoDoc(){
    console.log(this.radioCpfCnpj)
    this.modelCadastroUsuario.tipo_documento = this.radioCpfCnpj
  }

}
