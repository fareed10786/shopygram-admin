import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturedPageRoutingModule } from './featured-routing.module';

import { FeaturedPage } from './featured.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { SideMenuModule } from 'src/app/components/side-menu/side-menu.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SideMenuModule,
    DataTablesModule,
    FeaturedPageRoutingModule
  ],
  declarations: [FeaturedPage]
})
export class FeaturedPageModule {}
