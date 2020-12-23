import { Storage } from '@ionic/storage';
import { FbService } from './../fb.service';
import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

declare var dynamics: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public starredProducts = [];
  public checkStarredItems;
  public chooseItems = [];
  public chooseAlibabaItems = [];
  public infoOfChooseItems = [];

  public show = false;

  public amazonCheck;
  public alibabaCheck;
  constructor(
    public FBSrv: FbService,
    public storage: Storage,
    public alertController: AlertController,
    public navCtrl: NavController
  ) {
    // FBSrv.getStarredItems();
    FBSrv.getStarredProducts();
    console.log(FBSrv.starredItems);
  }

  /*----------------------------------------------------
              Report
  ------------------------------------------------------ */
  selectProducts() {
    this.show = true;
  }

  // storeReportHistoryToFirestore() {
  //   this.FBSrv.reportHistoryRef.add({
  //     userID: this.FBSrv.currentUser.uid,
  //     time: new Date(),
  //     products: this.FBSrv.chosenItemsDetails,
  //   });
  // }

  geneateReport() {
    console.log(this.chooseItems);
    this.FBSrv.starredProducts.map((data, i) => {
      this.chooseItems.map((item, index) => {
        if (i === index && item) {
          this.infoOfChooseItems.push(data);
        }
      });

      console.log(this.infoOfChooseItems);
    });
    this.amazonCheck = this.FBSrv.amazonProducts.subscribe((snapshot) => {
      this.FBSrv.chosenItemsDetails = [];
      snapshot.map((doc, index) => {
        this.infoOfChooseItems.map((values, i) => {
          if (values.itemID === doc.itemID) {
            this.FBSrv.chosenItemsDetails.push({ ...doc, type: 'amazon' });
          }
        });
      });
      this.amazonCheck.unsubscribe();
    });
    this.alibabaCheck = this.FBSrv.alibabaProducts.subscribe((snapshot) => {
      snapshot.map((doc, index) => {
        this.infoOfChooseItems.map((values, i) => {
          if (values.itemID === doc.itemID) {
            this.FBSrv.chosenItemsDetails.push({ ...doc, type: 'alibaba' });
          }
        });
      });
      this.alibabaCheck.unsubscribe();
      console.log(this.FBSrv.chosenItemsDetails);
      this.navCtrl.navigateRoot('/report');
      this.FBSrv.storeReportHistoryToFirestore();
    });
  }

  cancelSelection() {
    this.chooseAlibabaItems = [];
    this.chooseItems = [];
    this.show = false;
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
