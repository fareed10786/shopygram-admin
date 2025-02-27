import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public auth:AuthService) {
    if(window.localStorage.getItem("selectedBranch"))
    this.auth.selectedBranch = JSON.parse(window.localStorage.getItem('selectedBranch'));    

  }
  
}
