import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/category';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  
  categories:Array<Category>=[];
  category:Partial<Category>={};
  constructor(public auth:AuthService,public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getAllCategories();
  }

  public getAllCategories() {
    this.resolver.getAllCategories().subscribe((data:Category[])=>{
      this.categories = data;
    })
  }

  async openCrudModal(data:Category) {
    let def:Category = {
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
    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
      componentProps:{
        category:data??def
      }
    });
    modal.onDidDismiss().then((data)=>{
      this.getAllCategories();
    })
    return await modal.present();
  }

  public onStatusChange(id,event) {

   if(event.target.checked) {
     this.resolver.activateCategory(id).subscribe((data)=>{

     })
   } 
   else {
    this.resolver.deactivateCategory(id).subscribe((data)=>{
       
    })
   }
  }
}
