
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import firebase from 'firebase/compat/app'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import {AngularFireModule} from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HomeComponent } from './site/home/home.component';
import { UsuariosService } from './site/home/service/usuarios.service';

//prime
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { environment } from 'src/environments/environment';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AgmCoreModule } from '@agm/core';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { NgxSpinnerModule } from "ngx-spinner";
import { NovoComponent } from './site/novo/novo.component';
import { AppRoutingModule } from './app-routing.module';

export function initializeFirebaseApp() {
  return () => {
    firebase.initializeApp(environment.firebaseConfig); // Inicialize o Firebase aqui
  };
}

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent, HomeComponent, NovoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppLayoutModule,
    AutoCompleteModule,
    CalendarModule,
    ChipsModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    CascadeSelectModule,
    MultiSelectModule,
    InputTextareaModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgxSpinnerModule,
    RadioButtonModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDubaPuiD4Xlwz5r5gCrhJZvNM6nd_Scc4',
      libraries: ['places']
    }),
    GooglePlaceModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService,
    UsuariosService,
    { provide: APP_INITIALIZER, useFactory: initializeFirebaseApp, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Restante do código do construtor, se houver
  }
}
