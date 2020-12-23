import { NavController, ModalController } from '@ionic/angular';
import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.page.html',
  styleUrls: ['./edit-comment.page.scss'],
})
export class EditCommentPage implements OnInit {
  public index;
  public commentText;
  public commentCreated;
  constructor(
    public modalController: ModalController,
    public FBSrv: FbService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  handleTyping(e) {
    this.commentText = e.target.value;
  }

  handleEditComment() {
    if (!this.FBSrv.currentUser) {
      this.navCtrl.navigateRoot('/signin');
    } else {
      debugger;
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
              created: new Date(),
              text: this.commentText,
            };
            // check the existence of our comment amd replace with with new comment else keep old one
            const updatedComments = previousComments.map((item) =>
              item.created.seconds === this.commentCreated.seconds
                ? newComment
                : item
            );

            if (previousComments?.length > 0) {
              this.FBSrv.amazonRef
                .doc(this.index)
                .update({ comments: updatedComments });
              this.FBSrv.product.comments = updatedComments;
            }
          }
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
              },
              created: new Date(),
              text: this.commentText,
            };
            // check the existence of our comment
            const updatedComments = previousComments.map((item) =>
              item.created.seconds === this.commentCreated.seconds
                ? newComment
                : item
            );
            if (previousComments?.length > 0) {
              this.FBSrv.amazonRef
                .doc(this.index)
                .update({ comments: updatedComments });
              this.FBSrv.product.comments = updatedComments;
            }
          }
        });
    }
    this.dismiss();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
