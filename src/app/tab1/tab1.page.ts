import { FbService, Comment } from './../fb.service';
import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Observable } from 'rxjs/Observable';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  comments: Comment;
  public showSegment = 'amazon';
  constructor(public FBSrv: FbService) {
    this.comments = {} as Comment;
  }

  Insert() {
    this.FBSrv.InsertFB(this.comments)
      .then((data) => {
        alert('Item inserted Successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
