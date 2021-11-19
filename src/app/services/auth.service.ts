import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private firebaseService: FirebaseService,
		public fireAuth: AngularFireAuth
	){}

  public signUp(credentials, userInfo?) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
     .then(res => {
          userInfo.id = res.user.uid;
          this.firebaseService.addUser(userInfo)
          resolve(res)
        },
       err => reject(err))
   })
  }

  public signIn(credentials) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

	public signOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
      .then(() => {
        resolve();
      }).catch((error) => {
        reject();
      });
    })
  }
}