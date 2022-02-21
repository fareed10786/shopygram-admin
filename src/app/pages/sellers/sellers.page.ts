import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage implements OnInit {

  sellers:Array<any>=[];
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getsellers();
  }
  public getsellers() {
    this.controller.presentLoading("Getting sellers...");
    this.resolver.getSellerList().subscribe((data:any)=>{
      this.sellers = data;
    })
  }
  async openCrudModal(data:any) {
    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
      componentProps:{
        seller:data
      }
    });
    modal.onDidDismiss().then((data)=>{
      this.getsellers();
    })
    return await modal.present();
  }
}
