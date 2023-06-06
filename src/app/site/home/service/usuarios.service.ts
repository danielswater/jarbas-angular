import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, DocumentReference, getDoc, updateDoc, increment, onSnapshot, QueryDocumentSnapshot, doc } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { setDoc } from 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
import { push } from 'firebase/database';
import { getDatabase, ref, set, increment as rtdbIncrement, onValue } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService implements OnDestroy {

  private db = getFirestore();
  private dbRealtime = getDatabase();
  private usuariosCollection = collection(this.db, 'usuarios');
  private contadorRef = ref(this.dbRealtime, 'contador/usuarios');
  private notificacoesRef = ref(this.dbRealtime, 'notificacoes');

  private contadorSubject = new Subject<number>();
  private contadorUnsubscribe: any;

  constructor(private http: HttpClient) {
    initializeApp(environment.firebaseConfig);
  }

  async criarUsuario(usuario: any): Promise<void> {

    const newDocRef = doc(this.usuariosCollection);
    const usuarioComGeolocalizacao = {
      ...usuario,
      geolocalizacao: new GeoPoint(usuario.geolocalizacao.latitude, usuario.geolocalizacao.longitude)
    };
    await setDoc(newDocRef, usuarioComGeolocalizacao);
  
    // Atualizar o contador de cadastros no Realtime Database
    await set(this.contadorRef, rtdbIncrement(1));
  
    // Criar notificação de usuário criado
    const notificacao = {
      mensagem: 'Novo usuário criado',
      nome: usuario.nome_fantasia, // Adicione o nome do usuário na notificação
      data: new Date()
    };
    
    const notificacoesRef = ref(this.dbRealtime, 'notificacoes');
    const notificacaoRef = push(notificacoesRef);
    await set(notificacaoRef, notificacao);
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

  getNotificacoes(): Observable<any[]> {
    const orderedNotificacoesQuery = ref(this.dbRealtime, 'notificacoes');

    return new Observable<any[]>((observer) => {
      onValue(orderedNotificacoesQuery, (snapshot) => {
        const notificacoes: any[] = [];
        snapshot.forEach((childSnapshot) => {
          const notificacao = childSnapshot.val();
          notificacoes.push(notificacao);
        });
        observer.next(notificacoes);
      });
    });
  }
  getContadorUsuarios(): Observable<number> {
    return new Observable<number>((observer) => {
      const contadorRef = ref(this.dbRealtime, 'contador/usuarios');
  
      onValue(contadorRef, (snapshot) => {
        const contador = snapshot.val();
        observer.next(contador);
      });
    });
  }

  ngOnDestroy() {
    if (this.contadorUnsubscribe) {
      this.contadorUnsubscribe();
    }
  }
}