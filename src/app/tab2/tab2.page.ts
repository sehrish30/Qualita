import { Storage } from '@ionic/storage';
import { FbService } from './../fb.service';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
    FBSrv.getStarredItems();
    FBSrv.getStarredProducts();
  }

  deleteAllStarred() {
    this.storage.remove('id').then((data) => {
      console.log('Removed', data);
    });
    this.FBSrv.starredProducts = [];
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
