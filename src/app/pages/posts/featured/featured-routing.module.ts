import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturedPage } from './featured.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedPage
  },
  {
    path: 'crud',
    loadChildren: () => import('./crud/crud.module').then( m => m.CrudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturedPageRoutingModule {}
