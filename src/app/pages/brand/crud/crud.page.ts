import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {

  name:string = "";
  constructor(public resolver:ResolverService,public controller:ControllersService) {
    
  }

  ngOnInit() {
  }
  public addBrand() {
    let brand = {name:this.name};
    this.resolver.addBrand(brand).subscribe((data)=>{
      this.controller.presentAlert("The brand has been successfully added");
      this.controller.modalCtrl.dismiss();
    })
  }
}
