import { ActivatedRoute } from '@angular/router';
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
  public userReports = [];
  public check;
  public checkanother;
  public time;
  constructor(
    public FBSrv: FbService,
    public alertController: AlertController,
    public activatedrouter: ActivatedRoute
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

    this.checkanother = this.FBSrv.reportHistory.subscribe((snapshot) => {
      this.userReports = [];
      this.userReports = snapshot.map((doc) => {
        if (doc.userId === this.FBSrv.currentUser.uid) {
          return doc;
        }
      });
    });
  }

  ngOnInit() {}

  deleteSearch(id) {
    this.FBSrv.searchHistoryRef.doc(id).delete();
    this.userSearches.map((search) => {
      if (search.propertyId === id) {
        const index = this.userSearches.findIndex((x) => x.propertyId === id);
        this.userSearches.splice(index, 1);
      }
    });
  }

  deleteHistory() {
    if (this.showSegment === 'report') {
      this.deleteReport();
      return;
    }
    this.FBSrv.searchHistoryRef.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    this.userSearches = [];
  }

  deleteReport() {
    this.FBSrv.reportHistoryRef.ref.get().then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    this.userReports = [];
  }

  deletethisReport(id) {
    this.FBSrv.reportHistoryRef.doc(id).delete();
    this.userReports.map((report) => {
      if (report.propertyId === id) {
        const index = this.userReports.findIndex((x) => x.propertyId === id);
        this.userReports.splice(index, 1);
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `All your ${this.showSegment} will be deleted`,
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
