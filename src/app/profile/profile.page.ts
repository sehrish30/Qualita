import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FbService } from './../fb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public seed;
  constructor(
    public toastController: ToastController,
    public fbSrv: FbService,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController
  ) {
    if (!this.fbSrv.currentUser?.uid) {
      this.navCtrl.navigateForward('signin');
    }
    this.seed = Math.floor(Math.random() * 5000);
  }

  ngOnInit() {}

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      color: 'dark',
    });
    toast.present();
  }

  async logout() {
    await this.afAuth.signOut();
    this.presentToast('Successfully Signed Out');
    this.navCtrl.navigateForward('/signin');
  }
}
