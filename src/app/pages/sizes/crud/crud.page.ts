import { Component, Input, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  @Input() type:number = 1;
  @Input() sizes:Array<any>=[];
  selectedSizes:Set<any>=new Set();
  name:string = "";

  constructor(public resolver:ResolverService,public controller:ControllersService) {
    
   }

  ngOnInit() {
  }

  public toggleSelection(id:string) {
    if(this.isSizePresent(id)) {
      this.selectedSizes.delete(id)
      return;
    } 
    this.selectedSizes.add(id); 
  }
  public isSizePresent(id:string) {
    return this.selectedSizes.has(id);
  }
  public createBundle() {
    let bundle = {
      sizes:[],
      name:""
    };
    let sizes = Array.from(this.selectedSizes);
    bundle.sizes = sizes;
    bundle.name = this.name;
    this.resolver.addBundle(bundle).subscribe((data)=>{
      this.controller.presentAlert("The bundle has been successfully created");
      this.controller.modalCtrl.dismiss();
    })
  }
  public createSize() {
    let size = {name:this.name};
    this.resolver.addSize(size).subscribe((data)=>{
      this.controller.presentAlert("The size has been successfully created");
      this.controller.modalCtrl.dismiss();
    })
  }
}
