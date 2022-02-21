import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SideMenuComponent } from './side-menu.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports:[SideMenuComponent]
})
export class SideMenuModule { }
