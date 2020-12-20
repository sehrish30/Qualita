import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';

export interface Comment {
  Name: string;
  Description: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface editUser {
  name: string;
  email: string;
  newPassword: string;
  currentPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class FbService {
  public currentUser;
  public starredItems: any[] = [];
  public checkStarredItems;
  public starredProducts = [];
  public product = {};

  amazonRef: AngularFirestoreCollection;
  alibabaRef: AngularFirestoreCollection<any>;
  comments: Observable<Comment[]>;
  amazonProducts: Observable<any>;
  alibabaProducts: Observable<any>;
  searchHistoryRef: AngularFirestoreCollection<any>;
  searchHistory: Observable<any>;

  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public storage: Storage
  ) {
    /*-------------------------------------------
              Context Provider
  ---------------------------------------------- */
    this.currentUser = this.afAuth.authState;
    const authObserver = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser.uid);
        console.log(this.currentUser.photoURL);
        // this.navCtrl.navigateForward('/');
        authObserver.unsubscribe();
      } else {
        console.log('USER');
        this.currentUser = null;
        // this.navCtrl.navigateRoot('/signin');
        authObserver.unsubscribe();
      }
    });

    /*-------------------------------------------
              Firebase Collections
  ---------------------------------------------- */

    this.amazonRef = firestore.collection('amazon');
    this.alibabaRef = firestore.collection('alibaba');
    this.searchHistoryRef = firestore.collection('history');
    this.searchHistory = this.searchHistoryRef.valueChanges({
      idField: 'propertyId',
    });
    this.amazonProducts = this.amazonRef.valueChanges({
      idField: 'propertyId',
    });
    this.alibabaProducts = this.alibabaRef.valueChanges({
      idField: 'propertyId',
    });
    this.getStarredProducts();
    // amazonProducts: Observable<any>
    // this.amazonProducts = this.firestore.collection('alibaba').valueChanges()
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

  /*-------------------------------------------
              Validate Edit Profile
  ---------------------------------------------- */

  validateEditPage(user) {
    const errors: editUser = {} as editUser;

    if (!user.name) {
      errors.name = 'A username is required';
    }

    if (!user.email) {
      errors.email = 'Your email is invalid';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      errors.email = 'You email is invalid';
    }

    if (!user.currentPassword) {
      errors.currentPassword = 'Your password is required';
    } else if (user.currentPassword.length < 6) {
      errors.currentPassword = 'Password must be atleast 6 characters';
    }

    if (user.newPassword && user.newPassword.length < 6) {
      errors.newPassword = 'Password must be atleast 6 characters';
    }

    return errors;
  }

  /*-------------------------------------------
    Get Starred Items starred Items from local storage
  ---------------------------------------------- */
  async getStarredItems() {
    console.log('Now');
    try {
      const data = await this.storage.get('id');
      if (data) {
        this.starredItems = data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /*-------------------------------------------
      Set  Starred Items from local storage
  ---------------------------------------------- */
  async setStarredItems() {
    this.storage.set('id', this.starredItems);
  }

  /*-------------------------------------------
                 add to Fav
  ---------------------------------------------- */
  async addFavToLocalStorage(id, product) {
    const index = this.starredItems.indexOf(id);
    if (index > -1) {
      this.starredItems.splice(index, 1);
      this.starredProducts.splice(index, 1);
    } else {
      this.starredItems.push(id);
      this.starredProducts.push(product);
    }
    this.setStarredItems();
  }

  /*-------------------------------------------
    Get Fav Products from firebase
  ---------------------------------------------- */
  getStarredProducts() {
    this.getStarredItems();
    this.checkStarredItems = this.amazonProducts.subscribe((collection) => {
      this.starredProducts = [];
      console.log(this.starredItems);
      for (const doc of collection) {
        for (const stars of this.starredItems) {
          if (Number(doc.itemID) === Number(stars)) {
            console.log(doc.itemID, stars);
            this.starredProducts.push(doc);
            break;
          }
        }
      }
      this.checkStarredItems.unsubscribe();
    });
    this.checkStarredItems = this.alibabaProducts.subscribe((collection) => {
      console.log(this.starredItems);
      for (const doc of collection) {
        for (const stars of this.starredItems) {
          if (Number(doc.itemID) === Number(stars)) {
            console.log(doc.itemID, stars);
            this.starredProducts.push(doc);
            break;
          }
        }
      }
      console.log(this.starredProducts);
      this.checkStarredItems.unsubscribe();
    });
  }

  /*-------------------------------------------
              Save search history
  ---------------------------------------------- */
}
