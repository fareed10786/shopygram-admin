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

  order:any={};
  orderId:string = "";
  constructor(private activatedRoute:ActivatedRoute,public controller:ControllersService,public resolver:ResolverService) { 
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getOrderDetails();
  }
  public getOrderDetails() {
    this.resolver.getOrderById(this.orderId).subscribe((data:any)=>{
      this.order = data;
    })
  }
}
