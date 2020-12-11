import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { FbService } from './../fb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    public toastController: ToastController,
    public fbSrv: FbService,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      color: 'dark',
    });
    toast.present();
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.presentToast('Successfully Signed Out');
    this.navCtrl.navigateForward('/signin');
  }
}
