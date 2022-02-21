import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders:Array<any>=[];
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getOrders();
  }
  public getOrders() {
    this.controller.presentLoading("Getting orders...");
    this.resolver.getOrders().subscribe((data:any)=>{
      this.orders = data;
    })
  }
}
