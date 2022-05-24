import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  settings:any={
    featurePostInterval:5
  }
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getSettings();
  }

  public getSettings() {
    this.controller.presentLoading("Fetching settings...");
    this.resolver.getSettings("featurePostInterval").subscribe((data:any)=>{
      this.settings.featurePostInterval = data.settingValue;
      this.controller.loadCtrl.dismiss();
    })
  }
  public updateSettings() {
    this.controller.presentLoading("Saving settings...");
    //let keys = Object.keys(this.settings);
    let settings = {
      settingKey:'featurePostInterval',
      settingValue:this.settings.featurePostInterval.toString()
    };
    this.resolver.saveSettings(settings).subscribe((data)=>{

      this.controller.loadCtrl.dismiss();
      this.controller.modalCtrl.dismiss();
    })
  }
  
}
