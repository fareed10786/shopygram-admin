import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { SmrComponent } from './smr.component';



@NgModule({
  declarations: [SmrComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NgxSelectModule
  ],
  exports:[SmrComponent]
})
export class SmrModule { }
