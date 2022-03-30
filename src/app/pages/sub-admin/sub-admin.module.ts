import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubAdminPageRoutingModule } from './sub-admin-routing.module';

import { SubAdminPage } from './sub-admin.page';
import { DataTablesModule } from 'angular-datatables';
import { HeaderModule } from 'src/app/components/header/header.module';
import { SideMenuModule } from 'src/app/components/side-menu/side-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataTablesModule,
    HeaderModule,
    SideMenuModule,
    SubAdminPageRoutingModule
  ],
  declarations: [SubAdminPage]
})
export class SubAdminPageModule {}
