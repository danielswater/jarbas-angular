import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { UsuariosService } from './service/usuarios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
declare var google: any;
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form: FormGroup;

  @ViewChild('autocomplete') autocomplete:AutoComplete;

  isApiLoaded = false;
  cidadeSelecionada: any;
  cidades: any[] = [];
  suggestion: any
  options: any = {
    componentRestrictions: { country: 'BR', }
  }

  radioCpfCnpj = "CNPJ"

  loading: boolean = false;

  constructor
    (private service: UsuariosService,
      private spinner: NgxSpinnerService,
      private mapsAPILoader: MapsAPILoader,
      private httpClient: HttpClient,
      private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.isApiLoaded = true
    })

    this.form = this.formBuilder.group({
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      complemento: ['', Validators.required],
      cpf_cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      logradouro: ['', Validators.required],
      estado: ['SP',Validators.required],
      nome_fantasia: ['', Validators.required],
      nome_responsavel: ['', Validators.required],
      numero: ['', Validators.required],
      razao_social: ['', Validators.required],
      tipo_documento: ['CNPJ', Validators.required],
      telefone_estabelecimento: ['', Validators.required],
      telefone_responsavel: ['', Validators.required],
      geolocalizacao: ['']
    })
  }


  buscarCidades(event: any): void {
    const query = event.query;
    this.service.obterCidades('SP', query).subscribe((cidades: any[]) => {
      this.cidades = cidades;
    });
  }

  resetFormValues() {
    this.form = this.formBuilder.group({
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      complemento: ['', Validators.required],
      cpf_cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      logradouro: ['', Validators.required],
      estado: ['SP',Validators.required],
      nome_fantasia: ['', Validators.required],
      nome_responsavel: ['', Validators.required],
      numero: ['', Validators.required],
      razao_social: ['', Validators.required],
      tipo_documento: ['CNPJ', Validators.required],
      telefone_estabelecimento: ['', Validators.required],
      telefone_responsavel: ['', Validators.required],
      geolocalizacao: ['']
    });
  }
  


  selecionarCidade(event: any): void {
    //this.modelCadastroUsuario.cidade = event.value
    this.form.patchValue({cidade: event.value})
  }

  handleAddressChange(address: Address) {
    const streetName = this.extractStreetName(address);
    //this.modelCadastroUsuario.logradouro = streetName
    this.form.patchValue({logradouro: streetName})
    const neighborhood = this.extractNeighborhood(address);
    //this.modelCadastroUsuario.bairro = neighborhood
    this.form.patchValue({bairro: neighborhood})
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
        //this.modelCadastroUsuario.cep = cep;
        this.form.patchValue({cep: cep})
      }
    });
  }

  submitForm(){
    this.spinner.show()
    const endereco = `${this.form.controls['logradouro'].value}, ${this.form.controls['numero'].value} - ${this.form.controls['bairro'].value}, ${this.form.controls['cidade'].value} - SP, ${this.form.controls['cep'].value}, Brasil`;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: endereco }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();

        const geopoint = new GeoPoint(latitude, longitude);
        //this.modelCadastroUsuario.geolocalizacao = geopoint;
        this.form.patchValue({geolocalizacao: geopoint})

        const usuario = this.form.value;

        this.service.verificarExistenciaCampos(usuario)
        .then((response) => {
          if (response) {
            Swal.fire('Ocorreu um erro', 'CPF, CNPJ, ou Razão Social já cadastrados', 'error');
           this.spinner.hide()
            return;
          }
          this.service.criarUsuario(this.form.value)
          .then((response) => {
            console.log(response)
            this.spinner.hide()
            Swal.fire('Seja Bem-vindo', `${this.form.controls['nome_responsavel'].value}, seu cadastro foi efetuado com sucesso!`, 'success');
            this.autocomplete.hide()
            this.resetFormValues();
            this.clearValue()
            
          })
          .catch((error) => {
            this.spinner.hide()
            console.log('ERROR', error)
          });
        })
        .catch((error) => {
          console.log('Erro ao verificar existência de cadastros:', error);
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

  changeTipoDoc() {
    const tipoDoc = this.form.get('tipo_documento')?.value;
  
    if (tipoDoc === 'CPF') {
      this.form.get('cpf_cnpj')?.setValue(''); // Limpa o campo
    } else if (tipoDoc === 'CNPJ') {
      this.form.get('cpf_cnpj')?.setValue(''); // Limpa o campo
    }
  }

  clearValue(){
    this.suggestion = null;
  }
  
  getMask(): string {
    const tipoDoc = this.form.get('tipo_documento')?.value;
  
    return tipoDoc === 'CPF' ? '999.999.999-99' : '99.999.999/9999-99';
  }

}
