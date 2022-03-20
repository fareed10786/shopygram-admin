import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SizesPageRoutingModule } from './sizes-routing.module';

import { SizesPage } from './sizes.page';
import { DataTablesModule } from 'angular-datatables';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { SideMenuModule } from 'src/app/components/side-menu/side-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    FooterModule,
    SideMenuModule,
    DataTablesModule,
    SizesPageRoutingModule
  ],
  declarations: [SizesPage]
})
export class SizesPageModule {}
