import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    },
    misc:{
      penalty:{
        tat:0,
        cancel:0
      }
    }
  }
  newSecondLevelCategory:Category = {
    parentId: '',
    name: '',
    description: '',
    assets: {
      icon: '',
      image: ''
    },
    affiliateCommision: 0,
    platformCommision: 0,
    gender: 0,
    tat: 0
  }
  newThirdLevelCategory:Category = {
    parentId: '',
    name: '',
    description: '',
    assets: {
      icon: '',
      image: ''
    },
    affiliateCommision: 0,
    platformCommision: 0,
    gender: 0,
    tat: 0
  }
  id: string;
  subcategories: Array<any>=[];
  subsubcategories:Array<any>=[];
  level:number = 0;
  files: any;
  constructor(private activatedRoute:ActivatedRoute,public auth:AuthService,public resolver:ResolverService,public controller:ControllersService) { 
    this.activatedRoute.queryParams.subscribe((data)=>{
      if(data.id){
        this.id = data.id;
        this.getCategoryById();
      }
    })
  }

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
  public alterCategory(category:Category,id?:string,level:number = 0) {
    this.controller.presentLoading("Updating category...");
    if(id){
      this.addAffiliateCommission();
      this.addPlatformCommission();
 
    }
    let endpoint = id?this.resolver.updateCategory(id,category):this.resolver.addCategory(category);
    endpoint.subscribe((data:any)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();
        this.controller.presentToast("The category has been successfully added");
        if(data.id && level==0){
          this.newSecondLevelCategory.parentId = data.id;
          this.newSecondLevelCategory.description = this.category.description
          this.category.id = data.id;
        }
        if(level!=0)
        this.getSubCategories(category.parentId,level);

    })
  }
  public getSubCategories(id:string,level:number = 2) {
    if(level==2){
    this.newSecondLevelCategory.parentId = id;
    this.newSecondLevelCategory.description = this.category.description
    }if(level==3) {
      this.newThirdLevelCategory.parentId = id;
      this.newThirdLevelCategory.description = this.category.description

    }
    this.level = level
    this.resolver.getSubCategories(id).subscribe((data:any)=>{
      if(level==2)
      this.subcategories = data;
      if(level==3)
      this.subsubcategories = data
    });
  }
  
  public getCategoryById() {
    this.resolver.getCategoryById(this.id).subscribe((data:Category)=>{
      this.category = data;
      if(!this.category.misc){
        this.category.misc = {
          penalty:{
            cancel:0,
            tat:0
          }
        }

      }
      this.getSubCategories(this.id);
    })
  }
  public uploadFile(event) {

    let files = event.target.files;
    this.files = files;
    this.uploadFileToServer(this.files[0])
  }
  public uploadFileToServer(img) {

    let formData = new FormData();
    formData.append('file', img);
    this.resolver.uploadFile(6, formData).toPromise().then((data:any) => {
      this.category.assets.image = data.url;
  

    }).catch((err) => {
      console.log(err);
    }).finally(() => {

    })
  }
}
