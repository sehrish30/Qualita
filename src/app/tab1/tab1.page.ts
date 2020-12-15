import { FbService, Comment } from './../fb.service';
import { Component, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Observable } from 'rxjs/Observable';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  // comments: Comment;
  public showSegment = 'amazon';

  constructor(
    public FBSrv: FbService,
    public loadingController: LoadingController
  ) {
    // this.comments = {} as Comment;
    this.presentLoading();
    if (this.showSegment === 'alibaba') {
      this.presentLoading();
    }
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
