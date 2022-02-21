import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/category';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  @Input() category:Category = {
    parentId: '',
    name: '',
    description: '',

    affiliateCommision: 0,
    platformCommision: 0,
    gender: 0,
    tat: 0,
    assets: {
      icon: '',
      image: ''
    }
  }
  constructor(public auth:AuthService,public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
  }
  public addAffiliateCommission() {
    this.resolver.updateAffiliateCommission(this.category.id,{ "affiliateCommision": this.category.affiliateCommision}).subscribe((data)=>{
      
    })
  }
  public addPlatformCommission() {
    this.resolver.updatePlatformCommission(this.category.id,{ "platformCommision": this.category.platformCommision}).subscribe((data)=>{
      
    })
  } 
  public alterCategory() {
    this.controller.presentLoading("Updating category...");
    if(this.category.id){
      this.addAffiliateCommission();
      this.addPlatformCommission();

    }
    let endpoint = this.category.id?this.resolver.updateCategory(this.category.id,this.category):this.resolver.addCategory(this.category);
    endpoint.subscribe((data)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();
    })
  }
}
