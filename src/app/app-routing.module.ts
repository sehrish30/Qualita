import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./signin/signin.module').then((m) => m.SigninPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'forgot',
    loadChildren: () =>
      import('./forgot/forgot.module').then((m) => m.ForgotPageModule),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'product-detail/:productId',
    loadChildren: () =>
      import('./product-detail/product-detail.module').then(
        (m) => m.ProductDetailPageModule
      ),
  },
  // {
  //   path: 'comment-modal/:productId',
  //   loadChildren: () =>
  //     import('./comment-modal/comment-modal.module').then(
  //       (m) => m.CommentModalPageModule
  //     ),
  // },
  {
    path: 'edit-comment',
    loadChildren: () =>
      import('./edit-comment/edit-comment.module').then(
        (m) => m.EditCommentPageModule
      ),
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./history/history.module').then((m) => m.HistoryPageModule),
  },
  {
    path: 'trending',
    loadChildren: () => import('./trending/trending.module').then( m => m.TrendingPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
