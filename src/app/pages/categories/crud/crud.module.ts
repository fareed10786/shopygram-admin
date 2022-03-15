import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudPageRoutingModule } from './crud-routing.module';

import { CrudPage } from './crud.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { SideMenuModule } from 'src/app/components/side-menu/side-menu.module';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SideMenuModule,
    FooterModule,
    CrudPageRoutingModule
  ],
  declarations: [CrudPage]
})
export class CrudPageModule {}
