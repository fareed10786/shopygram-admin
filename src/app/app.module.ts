import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BarController, BarElement, Chart, Title, Tooltip, Legend, CategoryScale, LinearScale, LineController, LineElement, Point, PointElement, PieController, ArcElement } from 'chart.js';
import { AuthInterceptor } from './services/auth.intercepter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EmailModule } from './components/email/email.module';
Chart.register(BarController, LineController, PieController, LineElement, BarElement, PointElement,ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale)
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), HttpClientModule,
     MatButtonModule, 
     MatSelectModule,
     MatFormFieldModule,
     EmailModule,
     AppRoutingModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
