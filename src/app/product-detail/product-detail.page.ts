import { AngularFirestore } from '@angular/fire/firestore';
import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  public index;

  public product = {};
  constructor(
    public firestore: AngularFirestore,
    public activatedrouter: ActivatedRoute,
    public fbSrv: FbService
  ) {
    /*------------------------------------
      Get id from route
    -------------------------------------- */
    this.index = this.activatedrouter.snapshot.paramMap.get('productId');

    /*------------------------------------
       Collect product details from firebase
    -------------------------------------- */
    fbSrv.amazonRef
      .doc(this.index)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.product = { ...doc.data(), id: doc.id };
        } else {
          fbSrv.alibabaRef
            .doc(this.index)
            .ref.get()
            .then((alibabadoc) => {
              if (alibabadoc.exists) {
                this.product = { ...alibabadoc.data(), id: alibabadoc.id };
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  ngOnInit() {}
}
