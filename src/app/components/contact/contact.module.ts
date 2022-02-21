import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FooterModule } from '../footer/footer.module';



@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    FooterModule
  ],
  exports:[ContactComponent]
})
export class ContactModule { }
