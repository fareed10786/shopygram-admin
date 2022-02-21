import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PortPerformanceComponent } from './port-performance.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSelectModule } from 'ngx-select-ex';



@NgModule({
  declarations: [PortPerformanceComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ChartjsModule,
    NgxSelectModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports:[PortPerformanceComponent]
})
export class PortPerformanceModule { }
