import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';
import { DataTablesModule } from 'angular-datatables';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSelectModule } from 'ngx-select-ex';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { SalesManagerBookinngComponent } from './sales-manager-bookinng.component';



@NgModule({
  declarations: [SalesManagerBookinngComponent],
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
  exports:[SalesManagerBookinngComponent]
})
export class SalesManagerBookinngModule { }
