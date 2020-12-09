import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';

export interface Comment {
  Name: string;
  Description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FbService {
  amazonRef: AngularFirestoreCollection;
  alibabaRef: AngularFirestoreCollection<any>;
  comments: Observable<Comment[]>;
  amazonProducts: Observable<Comment[]>;
  alibabaProducts: Observable<any>;
  constructor(public firestore: AngularFirestore) {
    this.amazonRef = this.firestore.collection('amazon');
    this.alibabaRef = this.firestore.collection('alibaba');
    this.comments = this.alibabaRef.valueChanges();
    this.amazonProducts = this.amazonRef.valueChanges();
    this.alibabaProducts = this.alibabaRef.valueChanges();
  }

  // for inserting in firebase
  InsertFB(com): Promise<any> {
    return this.alibabaRef.add(com);
  }

  RemoveFB(id): Promise<any> {
    return this.alibabaRef.doc(id).delete();
  }
}
