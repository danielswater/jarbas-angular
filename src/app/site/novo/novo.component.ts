import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss']
})
export class NovoComponent implements OnInit {
  email: string = 'danielswater@gmail.com';
  password: string = '123456';

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        // O usuário foi criado com sucesso
        const user = userCredential.user;
        console.log('Usuário criado:', user);
      })
      .catch(error => {
        // Ocorreu um erro ao criar o usuário
        console.error('Erro ao criar usuário:', error);
      });
  }
}
