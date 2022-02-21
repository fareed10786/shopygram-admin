import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressbookPageRoutingModule } from './addressbook-routing.module';

import { AddressbookPage } from './addressbook.page';
import { FooterModule } from '../components/footer/footer.module';
import { HeaderModule } from '../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterModule,
    HeaderModule,
    AddressbookPageRoutingModule
  ],
  declarations: [AddressbookPage]
})
export class AddressbookPageModule {}
