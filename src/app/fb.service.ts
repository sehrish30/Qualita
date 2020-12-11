import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export interface Comment {
  Name: string;
  Description: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class FbService {
  public currentUser: Observable<any>;

  amazonRef: AngularFirestoreCollection;
  alibabaRef: AngularFirestoreCollection<any>;
  comments: Observable<Comment[]>;
  amazonProducts: Observable<any>;
  alibabaProducts: Observable<any>;

  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController
  ) {
    /*-------------------------------------------
              Context Provider
  ---------------------------------------------- */
    this.currentUser = this.afAuth.authState;
    const authObserver = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.navCtrl.navigateForward('/');
        authObserver.unsubscribe();
      } else {
        this.currentUser = null;
        this.navCtrl.navigateRoot('/signin');
        authObserver.unsubscribe();
      }
    });

    /*-------------------------------------------
              Firebase Collections
  ---------------------------------------------- */

    this.amazonRef = this.firestore.collection('amazon');
    this.alibabaRef = this.firestore.collection('alibaba');
    this.amazonProducts = this.amazonRef.valueChanges();
    this.alibabaProducts = this.alibabaRef.valueChanges();
  }

  // for inserting in firebase
  InsertFB(com): Promise<any> {
    return this.alibabaRef.add(com);
  }

  RemoveFB(id): Promise<any> {
    return this.alibabaRef.doc(id).delete();
  }

  /*-------------------------------------------
              Validate Signup
  ---------------------------------------------- */
  validateSignUp(user) {
    const errors = { name: '', email: '', password: '' };

    if (!user.name) {
      errors.name = 'A username is required';
    }

    if (!user.email) {
      errors.email = 'Your email is invalid';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      errors.email = 'You email is invalid';
    }

    if (!user.password) {
      errors.password = 'Your password is required';
    } else if (user.password.length < 6) {
      errors.password = 'Password must be atleast 6 characters';
    }

    return errors;
  }

  /*-------------------------------------------
              Validate Signin
  ---------------------------------------------- */
  validateSignIn(user) {
    const errors: User = {} as User;

    if (!user.email) {
      errors.email = 'Your email is invalid';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      errors.email = 'You email is invalid';
    }

    if (!user.password) {
      errors.password = 'Your password is required';
    } else if (user.password.length < 6) {
      errors.password = 'Password must be atleast 6 characters';
    }

    return errors;
  }

  /*-------------------------------------------
              Validate Forgot password
  ---------------------------------------------- */
  validateForgotPass(user) {
    const errors: User = {} as User;

    if (!user.email) {
      errors.email = 'Your email is invalid';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      errors.email = 'You email is invalid';
    }

    return errors;
  }
}
