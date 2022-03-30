import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubAdminPage } from './sub-admin.page';

const routes: Routes = [
  {
    path: '',
    component: SubAdminPage
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
export class SubAdminPageRoutingModule {}
