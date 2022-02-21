import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackPageRoutingModule } from './track-routing.module';

import { TrackPage } from './track.page';
import { HeaderModule } from '../components/header/header.module';
import { SideMenuModule } from '../components/side-menu/side-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SideMenuModule,
    TrackPageRoutingModule
  ],
  declarations: [TrackPage]
})
export class TrackPageModule {}
