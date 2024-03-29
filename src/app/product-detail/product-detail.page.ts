import { EditCommentPage } from './../edit-comment/edit-comment.page';
import { CommentModalPage } from './../comment-modal/comment-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FbService } from './../fb.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ReversePipe } from 'ngx-pipes';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  providers: [ReversePipe],
})
export class ProductDetailPage implements OnInit {
  public index;

  public product: {} = {} as any;
  public go = false;
  public showSegrment = 'amazon';
  public seed;

  constructor(
    public firestore: AngularFirestore,
    public activatedrouter: ActivatedRoute,
    public FBSrv: FbService,
    public modalController: ModalController,
    public navCtrl: NavController
  ) {
    this.seed = Math.floor(Math.random() * 5000);
    this.FBSrv.getStarredItems();
    /*------------------------------------
      Get id from route
    -------------------------------------- */
    this.index = this.activatedrouter.snapshot.paramMap.get('productId');

    /*------------------------------------
       Collect product details from firebase
    -------------------------------------- */
    FBSrv.amazonRef
      .doc(this.index)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.product = { ...doc.data(), id: doc.id, type: 'amazon' };
          FBSrv.product = this.product;
        } else {
          FBSrv.alibabaRef
            .doc(this.index)
            .ref.get()
            .then((alibabadoc) => {
              if (alibabadoc.exists) {
                this.product = {
                  ...alibabadoc.data(),
                  id: alibabadoc.id,
                  type: 'alibaba',
                };
                FBSrv.product = this.product;
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

  /*------------------------------------
       Delete comments
    -------------------------------------- */
  handleDeleteComment(productId, commentCreatedDate) {
    this.FBSrv.amazonRef
      .doc(productId)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const updatedComments = previousComments.filter(
            (item) => item.created.seconds !== commentCreatedDate.seconds
          );

          this.FBSrv.amazonRef
            .doc(productId)
            .update({ comments: updatedComments });

          this.FBSrv.product.comments = updatedComments;
        }
      });

    this.FBSrv.alibabaRef
      .doc(productId)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const updatedComments = previousComments.filter(
            (item) => item.created.seconds !== commentCreatedDate.seconds
          );
          this.FBSrv.alibabaRef
            .doc(productId)
            .update({ comments: updatedComments });
          this.FBSrv.product.comments = updatedComments;
        }
      })
      .catch((err) => console.error(err));
  }

  async presentModal(comment, prodId) {
    const modal = await this.modalController.create({
      component: CommentModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        commentText: comment,
        index: prodId,
      },
    });

    return await modal.present();
  }

  async presentEditModal(comment, prodId, commentCreated) {
    const modal = await this.modalController.create({
      component: EditCommentPage,
      cssClass: 'my-custom-class',
      componentProps: {
        commentText: comment,
        index: prodId,
        commentCreated,
      },
    });
    return await modal.present();
  }

  async addLike(prodId) {
    if (!this.FBSrv.currentUser) {
      this.navCtrl.navigateForward('/signin');
    } else {
      this.FBSrv.amazonRef
        .doc(prodId)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            const product = doc.data();
            const previousVotes = product.votes;
            const vote = {
              votedBy: {
                id: this.FBSrv.currentUser.uid,
                name: this.FBSrv.currentUser.displayName,
              },
            };

            if (previousVotes) {
              // checking if the user has not already voted
              const checkVote = (vote) => {
                return vote.votedBy.id !== this.FBSrv.currentUser.uid;
              };
              this.go = product.votes.every(checkVote);

              if (this.go) {
                const updatedVotes = [...previousVotes, vote];
                const voteCount = updatedVotes.length;
                this.FBSrv.amazonRef
                  .doc(prodId)
                  .update({ votes: updatedVotes, voteCount });
                this.FBSrv.product.voteCount = voteCount;
              }
            } else {
              const updatedVotes = [vote];
              const voteCount = updatedVotes.length;
              this.FBSrv.amazonRef
                .doc(prodId)
                .update({ votes: updatedVotes, voteCount });
              this.FBSrv.product.voteCount = voteCount;
            }
          }
        });

      this.FBSrv.alibabaRef
        .doc(prodId)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            const product = doc.data();
            const previousVotes = product.votes;
            const vote = {
              votedBy: {
                id: this.FBSrv.currentUser.uid,
                name: this.FBSrv.currentUser.displayName,
              },
            };

            if (previousVotes) {
              // checking if the user has not already voted
              const checkVote = (vote) => {
                return vote.votedBy.id !== this.FBSrv.currentUser.uid;
              };
              this.go = product.votes.every(checkVote);

              if (this.go) {
                const updatedVotes = [...previousVotes, vote];
                const voteCount = updatedVotes.length;
                this.FBSrv.amazonRef
                  .doc(prodId)
                  .update({ votes: updatedVotes, voteCount });
                this.FBSrv.product.voteCount = voteCount;
              }
            } else {
              const updatedVotes = [vote];
              const voteCount = updatedVotes.length;
              this.FBSrv.alibabaRef
                .doc(prodId)
                .update({ votes: updatedVotes, voteCount });
              this.FBSrv.product.voteCount = voteCount;
            }
          }
        });
    }
  }

  /*------------------------------------
       Share Product
    -------------------------------------- */
  async basicShare() {
    // debugger;
    let shareRet = await Share.share({
      title: `${this.FBSrv.product.title}`,
      text: `${this.FBSrv.product.price} Price ${this.FBSrv.product.rating} Rating`,
      url: `https://product-detail/${this.FBSrv.product.itemID}`,
      dialogTitle: 'Share with buddies',
    });
  }

  ngOnInit() {}
}
