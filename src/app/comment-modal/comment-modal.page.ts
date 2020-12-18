import { NavController } from '@ionic/angular';
import { FbService } from './../fb.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.page.html',
  styleUrls: ['./comment-modal.page.scss'],
})
export class CommentModalPage implements OnInit {
  public index;
  public action;
  public commentText;
  public updatedComments = [];

  constructor(
    public activatedrouter: ActivatedRoute,
    public FBSrv: FbService,
    public navCtrl: NavController,
    public modalController: ModalController
  ) {
    this.index = this.activatedrouter.snapshot.paramMap.get('productId');
  }

  ngOnInit() {}

  handleSendAction() {
    if (!this.FBSrv.currentUser) {
      this.navCtrl.navigateRoot('/signin');
    } else {
      this.FBSrv.amazonRef
        .doc(this.index)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            const previousComments = doc.data().comments;
            const newComment = {
              postedBy: {
                id: this.FBSrv.currentUser.uid,
                name: this.FBSrv.currentUser.displayName,
              },
              created: Date.now(),
              text: this.commentText,
            };
            if (previousComments?.length > 0) {
              this.updatedComments = [...previousComments, newComment];
              this.FBSrv.product.comments = this.updatedComments;
              this.dismiss();
            } else {
              this.updatedComments = [newComment];
              this.FBSrv.product.comments = this.updatedComments;
              this.dismiss();
            }
            this.FBSrv.amazonRef
              .doc(this.index)
              .update({ comments: this.updatedComments });
          }
        })
        .catch((err) => {
          console.error(err);
        });

      this.FBSrv.alibabaRef
        .doc(this.index)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            const previousComments = doc.data().comments;
            const newComment = {
              postedBy: {
                id: this.FBSrv.currentUser.uid,
                name: this.FBSrv.currentUser.displayName,
                // photo: this.FBSrv.currentUser.photoUrl ||
              },
              created: Date.now(),
              text: this.commentText,
            };
            if (previousComments?.length > 0) {
              this.updatedComments = [...previousComments, newComment];
              this.FBSrv.product.comments = this.updatedComments;
              this.dismiss();
            } else {
              this.updatedComments = [newComment];
              this.FBSrv.product.comments = this.updatedComments;
              this.dismiss();
            }

            this.FBSrv.alibabaRef
              .doc(this.index)
              .update({ comments: this.updatedComments });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
