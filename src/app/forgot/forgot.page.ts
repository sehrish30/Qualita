import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  public user = { email: '' };
  public stop = false;
  constructor(
    public fbSrv: FbService,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {}

  ngOnInit() {}

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      color: 'dark',
    });
    toast.present();
  }

  resetPassword(email) {
    this.stop = true;
    const validationErrors = this.fbSrv.validateForgotPass(this.user);
    // Object.keys because if no error {} will be return
    if (!Object.keys(validationErrors).length) {
      this.afAuth
        .sendPasswordResetEmail(email)
        .then((response) => {
          this.presentToast('Check your email to reset Password');
          this.stop = false;
          this.router.navigateByUrl('/signin');
        })
        .catch((err) => {
          console.error('Reset Password error', err);
          this.presentToast(err.message);
          this.stop = false;
        });

      this.user = { email: '' };
    } else {
      this.presentToast(Object.values(validationErrors).join(' '));
    }
  }
}
