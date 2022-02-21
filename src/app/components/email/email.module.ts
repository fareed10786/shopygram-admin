import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from './email.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TagInputModule } from 'ngx-chips';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [EmailComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TagInputModule,
    AngularEditorModule,
    NgxSummernoteModule
  ]
})
export class EmailModule { }
