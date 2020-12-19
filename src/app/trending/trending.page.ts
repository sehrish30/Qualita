import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  public trendingProducts: [] = [];
  public allProducts: Observable<any[]>;
  public alibabaProducts: Observable<any[]>;
  public amazonCollection: AngularFirestoreCollection;
  public alibabaCollection: AngularFirestoreCollection;
  constructor(public FBSrv: FbService, public afs: AngularFirestore) {
    this.amazonCollection = afs.collection('amazon', (ref) =>
      ref.orderBy('voteCount', 'desc')
    );
    this.allProducts = this.amazonCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          return {
            id: a.payload.doc.id,
            ...a.payload.doc.data(),
            type: 'amazon',
          };
        });
      })
    );

    this.alibabaCollection = afs.collection('alibaba', (ref) =>
      ref.orderBy('voteCount')
    );
    this.alibabaProducts = this.alibabaCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          return {
            id: a.payload.doc.id,
            ...a.payload.doc.data(),
            type: 'alibaba',
          };
        });
      })
    );
  }

  ngOnInit() {}
}
