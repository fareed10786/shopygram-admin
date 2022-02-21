import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products:Array<any>=[];
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getproducts();
  }
  public getproducts() {
    this.controller.presentLoading("Getting products...");
    this.resolver.getProducts().subscribe((data:any)=>{
      this.products = data;
    })
  }

}
