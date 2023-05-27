import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
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
import { initializeApp } from 'firebase/app';

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


//AIzaSyDubaPuiD4Xlwz5r5gCrhJZvNM6nd_Scc4
import { NgxSpinnerModule } from "ngx-spinner";

export function initializeFirebaseApp() {
  return () => initializeApp(environment.firebaseConfig);
}

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent, HomeComponent
  ],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    FormsModule,
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
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
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
