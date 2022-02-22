import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'annually',
    loadChildren: () => import('./sales/annually/annually.module').then( m => m.AnnuallyPageModule)
  },
  {
    path: 'weekly',
    loadChildren: () => import('./sales/weekly/weekly.module').then( m => m.WeeklyPageModule)
  },
  {
    path: 'monthly',
    loadChildren: () => import('./sales/monthly/monthly.module').then( m => m.MonthlyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
