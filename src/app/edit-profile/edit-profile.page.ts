import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import {
  ToastController,
  NavController,
  LoadingController,
} from '@ionic/angular';
import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public stop = false;
  public user = {
    email: this.fbSrv.currentUser?.email,
    name: this.fbSrv.currentUser?.displayName,
    currentPassword: '',
    newPassword: '',
  };
  constructor(
    public fbSrv: FbService,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) {
    console.log(this.fbSrv.currentUser);
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000,
    });
    await loading.present();

    await loading.onDidDismiss();
  }

  async editProfile(name, email, currentPassword, newPassword) {
    this.stop = true;
    const validationErrors = this.fbSrv.validateEditPage(this.user);
    // console.log(validationErrors);
    if (!Object.keys(validationErrors).length) {
      this.presentLoading();
      /*--------------------------------------
              Reauthenticate user
        -------------------------------------- */
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        currentPassword
      );
      try {
        await this.fbSrv.currentUser.reauthenticateWithCredential(credential);
        console.log('Reauthentication Successfull');
      } catch (err) {
        console.error('Profile update error', err.message);
        this.presentToast(err.message);
      }

      /*--------------------------------------
              Update Profile
        -------------------------------------- */
      const updateProfile = this.fbSrv.currentUser.updateProfile({
        displayName: name,
      });
      const updateEmail = this.fbSrv.currentUser.updateEmail(email);
      if (newPassword) {
        await this.fbSrv.currentUser.updatePassword(newPassword);
      }

      const response = Promise.all([updateProfile, updateEmail]);

      /*--------------------------------------
              Sign in user
        -------------------------------------- */
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        newPassword || currentPassword
      );
      this.fbSrv.currentUser = result.user;
      this.navCtrl.navigateBack('/tabs/tab4');

      this.stop = false;
    } else {
      this.presentToast(Object.values(validationErrors).join(' '));
      this.stop = false;
    }
  }
}
