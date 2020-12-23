import { FbService, Comment } from './../fb.service';
import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IonInfiniteScroll, NavController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  // comments: Comment;
  public showSegment = 'amazon';
  public starred = [];
  public chooseItems = [];
  public chooseAlibabaItems = [];
  public show = false;

  public amazonCheck;
  public alibabaCheck;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public FBSrv: FbService,
    public loadingController: LoadingController,
    public storage: Storage,
    public navCtrl: NavController
  ) {
    // this.comments = {} as Comment;
    this.presentLoading();
    FBSrv.getStarredItems();
  }

  selectProducts() {
    this.show = true;
  }

  geneateReport() {
    console.log(this.chooseItems);
    this.amazonCheck = this.FBSrv.amazonProducts.subscribe((snapshot) => {
      this.FBSrv.chosenItemsDetails = [];
      snapshot.map((doc, index) => {
        this.chooseItems.map((values, i) => {
          if (i === index) {
            this.FBSrv.chosenItemsDetails.push({ ...doc, type: 'amazon' });
          }
        });
      });
      this.amazonCheck.unsubscribe();
    });
    this.alibabaCheck = this.FBSrv.alibabaProducts.subscribe((snapshot) => {
      snapshot.map((doc, index) => {
        this.chooseAlibabaItems.map((values, i) => {
          if (i === index) {
            this.FBSrv.chosenItemsDetails.push({ ...doc, type: 'alibaba' });
          }
        });
      });
      this.alibabaCheck.unsubscribe();
      console.log(this.FBSrv.chosenItemsDetails);
      this.navCtrl.navigateRoot('/report');
      this.FBSrv.storeReportHistoryToFirestore();
    });
    console.log(this.FBSrv.chosenItemsDetails);
  }

  cancelSelection() {
    this.chooseAlibabaItems = [];
    this.chooseItems = [];
    this.show = false;
  }

  loadData(event) {
    setTimeout(() => {
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      const check = this.FBSrv.amazonProducts.subscribe((data) => {
        if (data.length === 100) {
          event.target.disabled = true;
        }
        check.unsubscribe();
      });
      // if (this.FBSrv.amazonProducts) {
      //   event.target.disabled = true;
      // }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  // Insert() {
  //   this.FBSrv.InsertFB(this.comments)
  //     .then((data) => {
  //       alert('Item inserted Successfully');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
}
