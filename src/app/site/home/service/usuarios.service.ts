import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, DocumentReference, getDoc , updateDoc, increment} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { setDoc, doc } from 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private db = getFirestore();

  constructor(private http: HttpClient) {
    initializeApp(environment.firebaseConfig);
  }

  criarUsuario(usuario: any) {
    const usersCollection = collection(this.db, 'usuarios');
    const newDocRef = doc(usersCollection);
    const usuarioComGeolocalizacao = {
      ...usuario,
      geolocalizacao: new GeoPoint(usuario.geolocalizacao.latitude, usuario.geolocalizacao.longitude)
    };
    return setDoc(newDocRef, usuarioComGeolocalizacao);
  }

  obterCidades(estado: string, query: string): Observable<any[]> {
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;
    return this.http.get<any[]>(url).pipe(
      map((cidades: any[]) => {
        const cidadesFiltradas = cidades.filter(cidade => cidade.nome.toLowerCase().includes(query.toLowerCase()));
        return cidadesFiltradas.map(cidade => ({ label: cidade.nome, value: cidade.nome }));
      })
    );
  }

}



// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, set, increment } from 'firebase/database';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsuariosService {

//   private db = getDatabase();

//   constructor(private http: HttpClient) {
//     initializeApp(environment.firebaseConfig);
//   }

//   criarUsuario(usuario: any): Promise<void> {
//     const usersRef = ref(this.db, 'usuarios');
//     const contadorRef = ref(this.db, 'contador/usuarios');

//     // Atualizar o contador de cadastros
//     return set(contadorRef, increment(1))
//       .then(() => {
//         // Salvar o usuário no Realtime Database
//         return set(usersRef, usuario);
//       });
//   }

//   obterCidades(estado: string, query: string): Observable<any[]> {
//     const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;
//     return this.http.get<any[]>(url).pipe(
//       map((cidades: any[]) => {
//         const cidadesFiltradas = cidades.filter(cidade => cidade.nome.toLowerCase().includes(query.toLowerCase()));
//         return cidadesFiltradas.map(cidade => ({ label: cidade.nome, value: cidade.nome }));
//       })
//     );
//   }
// }
