import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, DocumentReference, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private db = getFirestore();

  constructor() {
    initializeApp(environment.firebaseConfig);
  }

  criarUsuario(usuario: any) {
    const usersCollection = collection(this.db, 'user');
    return addDoc(usersCollection, usuario);
  }
}
