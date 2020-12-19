import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { ReversePipe } from 'ngx-pipes';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  providers: [ReversePipe],
})
export class HistoryPage implements OnInit {
  public showSegment = 'search';
  public userSearches = [];
  public check;
  constructor(
    public FBSrv: FbService,
    public alertController: AlertController
  ) {
    this.check = this.FBSrv.searchHistory.subscribe((snapshot) => {
      this.userSearches = [];
      snapshot.map((doc) => {
        if (doc.userId === this.FBSrv.currentUser.uid) {
          this.userSearches.push(doc);
        }
      });

      this.check.unsubscribe();
    });
  }

  ngOnInit() {}

  deleteSearch(id) {
    this.FBSrv.searchHistoryRef.doc(id).delete();
    this.userSearches.map((search) => {
      if (search.propertyId === id) {
        let index = this.userSearches.findIndex((x) => x.propertyId === id);
        this.userSearches.splice(index, 1);
      }
    });
  }

  deleteHistory() {
    this.FBSrv.searchHistoryRef.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    this.userSearches = [];
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'All your search history will be deleted',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteHistory();
          },
        },
      ],
    });
    await alert.present();
  }
}
