import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  product:any={};
  productId:string = "";
  constructor(private activatedRoute:ActivatedRoute,public controller:ControllersService,public resolver:ResolverService) { 
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getProductDetails();
  }
  public getProductDetails() {
    this.resolver.getProductById(this.productId).subscribe((data:any)=>{
      this.product = data;
    })
  }
}
