import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesPage } from './roles.page';

const routes: Routes = [
  {
    path: '',
    component: RolesPage
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
export class RolesPageRoutingModule {}
