import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports:[FooterComponent]
})
export class FooterModule { }
