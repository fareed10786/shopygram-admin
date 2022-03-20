import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandPage } from './brand.page';

const routes: Routes = [
  {
    path: '',
    component: BrandPage
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
export class BrandPageRoutingModule {}
