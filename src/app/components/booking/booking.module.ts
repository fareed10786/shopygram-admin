import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './booking.component';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSelectModule } from 'ngx-select-ex';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';



@NgModule({
  declarations: [BookingComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterModule,
    HeaderModule,
    NgxSelectModule,
    DataTablesModule,
    MatButtonModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports:[BookingComponent]
})
export class BookingModule { }
