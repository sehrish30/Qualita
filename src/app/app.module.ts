import { EditCommentPageModule } from './edit-comment/edit-comment.module';
import { CommentModalPageRoutingModule } from './comment-modal/comment-modal-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { AppComponent } from './app.component';

// import { AngularFireModule } from 'angularfire2';
// // import { AngularFireDatabaseModule } from "angularfire2/database";
// import { AngularFirestoreModule } from 'angularfire2/firestore';
// import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Observable } from 'rxjs';

//NEW
// import { AngularFirestoreModule } from "@angular/fire/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyDxoKIJ5JapoI2XR3cRRvu11bTbtnKK8PI',
  authDomain: 'qualita-4d94b.firebaseapp.com',
  projectId: 'qualita-4d94b',
  storageBucket: 'qualita-4d94b.appspot.com',
  messagingSenderId: '120312607137',
  appId: '1:120312607137:web:0e7639cd28263811821be0',
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    CommentModalPageRoutingModule,
    EditCommentPageModule,
    NgPipesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
