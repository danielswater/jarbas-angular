import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { CadastroUsuario } from './interface/CadastroUsuario.interface';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import firebase from 'firebase/compat/app';
import { getFirestore, GeoPoint } from 'firebase/firestore';
import 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isApiLoaded = false;

  options: any = {
    componentRestrictions: { country: 'BR', }
  }

  modelCadastroUsuario: CadastroUsuario = {
    bairro: '',
    cep: '',
    cidade: '',
    complemento: '',
    cpf_cnpj: '',
    email: '',
    logradouro: '',
    estado: '',
    nome_fantasia: '',
    nome_responsavel: '',
    numero: '',
    razao_social: '',
    senha: '',
    telefone_estabelecimento: '',
    telefone_responsavel: '',
    geolocalizacao : new GeoPoint(0, 0)
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

  handleAddressChange(address: Address) {
    const streetName = this.extractStreetName(address);
    const neighborhood = this.extractNeighborhood(address);
    const city = this.extractCity(address);
    const state = this.extractState(address);
  
    const fullAddress = `${streetName}, ${neighborhood}, ${city}, ${state}`;
  
    const apiUrl = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: fullAddress,
      format: 'json',
      limit: '1'
    };
  
    this.httpClient.get<any[]>(apiUrl, { params }).subscribe((response) => {
      if (response.length > 0) {
        const latitude = parseFloat(response[0].lat);
        const longitude = parseFloat(response[0].lon);
        console.log(latitude, longitude);
  
        const geopoint = new GeoPoint(latitude, longitude);
        this.modelCadastroUsuario.geolocalizacao = geopoint;
        console.log('this.modelCadastroUsuario.geolocalizacao', this.modelCadastroUsuario.geolocalizacao)
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

  extractCity(address: Address): string {
    const cityComponent = address.address_components.find(component =>
      component.types.includes('locality')
    );

    return cityComponent ? cityComponent.long_name : '';
  }

  extractState(address: Address): string {
    const stateComponent = address.address_components.find(component =>
      component.types.includes('administrative_area_level_1')
    );

    return stateComponent ? stateComponent.long_name : '';
  }

  salvar() {
    // this.spinner.show()
    this.loading = true;
    this.service.criarUsuario(this.modelCadastroUsuario)
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
