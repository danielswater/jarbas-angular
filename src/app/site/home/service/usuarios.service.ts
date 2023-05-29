import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, DocumentReference, getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private db = getFirestore();

  constructor(private http: HttpClient) {
    initializeApp(environment.firebaseConfig);
  }

  criarUsuario(usuario: any) {
    const usersCollection = collection(this.db, 'user');
    return addDoc(usersCollection, usuario);
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
