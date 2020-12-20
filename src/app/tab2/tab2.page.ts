import { Storage } from '@ionic/storage';
import { FbService } from './../fb.service';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

declare var dynamics: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public starredProducts = [];
  public checkStarredItems;
  constructor(
    public FBSrv: FbService,
    public storage: Storage,
    public alertController: AlertController
  ) {
    // FBSrv.getStarredItems();
    FBSrv.getStarredProducts();
    console.log(FBSrv.starredItems);
  }

  deleteAllStarred() {
    this.storage.remove('id').then((data) => {
      console.log('Removed', data);
    });
    this.FBSrv.starredProducts = [];
    this.FBSrv.starredItems = [];
    this.animateCard();
  }

  animateCard() {
    const el = document.getElementById('stars');
    dynamics.animate(
      el,
      {
        translateY: -100,
        scale: 1,
        opacity: 0.8,
      },
      {
        type: dynamics.spring,
        frequency: 200,
        friction: 200,
        duration: 2000,
        // complete: () => {
        //   // stop animation
        //   this.deleteAllStarred();
        // },
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: '<strong>Are you sure you want to delete all items?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteAllStarred();
          },
        },
      ],
    });

    await alert.present();
  }
}
