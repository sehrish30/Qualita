import { FbService, User } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    public fbSrv: FbService,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public loadingController: LoadingController,
    public router: Router
  ) {}
  public user: User = {} as User;
  // public user: {name:'', password: ''}
  ngOnInit() {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      color: 'dark',
    });
    toast.present();
  }

  async signUp(name, email, password) {
    const validationErrors = this.fbSrv.validateSignUp(this.user);
    if (Object.values(validationErrors).every((x) => x === null || x === '')) {
      this.presentLoading();
      try {
        const newUser = await this.afAuth.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        newUser.user.updateProfile({
          displayName: name,
        });
        const msg = 'You have successfully signed up';
        this.presentToast(msg);
        this.router.navigateByUrl('/');
      } catch (err) {
        console.error('Registeration error', err);
        this.presentToast(err.message);
      }

      this.user = { name: '', email: '', password: '' };
    } else {
      const errorMsg = Object.values(validationErrors).join(' ');
      this.presentToast(errorMsg);
    }
  }
}
