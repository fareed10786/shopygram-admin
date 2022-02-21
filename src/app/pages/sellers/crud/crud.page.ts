import { Component, Input, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {
  @Input() seller:any;
  reason:string = "";
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
  }
  public viewDocument(url:string) {
    window.open(url,"_blank");
  }
  public onStatusChange() {

    this.controller.presentLoading("Updating status...");
    if(this.seller.basicInfo.status==1) {
      this.resolver.approveSeller(this.seller.basicInfo.id).subscribe((data)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();

      })
    } 
    else {
      
      this.resolver.rejectSeller(this.seller.basicInfo.id,this.reason).subscribe((data)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();
      })
    }
  }
}
