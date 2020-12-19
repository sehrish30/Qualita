import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { FbService, User } from './../fb.service';

declare var dynamics: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  public stop = false;
  constructor(
    public navCtrl: NavController,
    public fbSrv: FbService,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public loadingController: LoadingController
  ) {}
  public user: User = {} as User;
  ngOnInit() {}

  animatePic(email, password) {
    const el = document.getElementById('logo');
    dynamics.animate(
      el,
      {
        translateY: 100,
        scale: 1.5,
        opacity: 0.5,
      },
      {
        type: dynamics.spring,
        frequency: 200,
        friction: 200,
        duration: 1500,
        complete: () => {
          this.signIn(email, password);
        },
      }
    );
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      color: 'dark',
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000,
    });
    await loading.present();

    await loading.onDidDismiss();
  }

  async signIn(email, password) {
    this.stop = true;
    const validationErrors = this.fbSrv.validateSignIn(this.user);
    if (!Object.keys(validationErrors).length) {
      this.presentLoading();
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          this.presentToast('You have successfully signed in');
          this.stop = false;
          this.navCtrl.navigateBack('/');
        })
        .catch((err) => {
          console.error('Login Error', err);
          this.presentToast(err.message);
          this.stop = false;
        });

      this.user = { name: '', email: '', password: '' };
    } else {
      // Object.values creates an array and joins form a string with a gap
      this.presentToast(Object.values(validationErrors).join(' '));
      this.stop = false;
    }
  }
}
