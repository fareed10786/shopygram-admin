import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsPage } from './posts.page';

const routes: Routes = [
  {
    path: '',
    component: PostsPage
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'featured',
    loadChildren: () => import('./featured/featured.module').then( m => m.FeaturedPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsPageRoutingModule {}
