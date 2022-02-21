import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';
import { HeaderModule } from '../components/header/header.module';
import { FooterModule } from '../components/footer/footer.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButtonModule } from '@angular/material/button';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxTypeaheadModule } from "ngx-typeahead";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HeaderModule,
    FooterModule,
    FileUploadModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    IonicSelectableModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMatSelectSearchModule,
    NgxSelectModule,
    NgxTypeaheadModule,
    BookingPageRoutingModule
  ],
  declarations: [BookingPage]
})
export class BookingPageModule {}
