import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SizesPage } from './sizes.page';

const routes: Routes = [
  {
    path: '',
    component: SizesPage
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
export class SizesPageRoutingModule {}
