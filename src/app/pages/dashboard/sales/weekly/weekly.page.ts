import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResolverService } from 'src/app/services/resolver.service';

const WEEK = 604800000

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.page.html',
  styleUrls: ['./weekly.page.scss'],
})
export class WeeklyPage implements OnInit {
  selectedSegment:number = 1;
  sales:Array<any>=[];

  response:Array<any>=[];
  startDate:Date = new Date();
  endDate:Date = new Date();
  allowSaleStatuses:Array<any>=[1,2,3,4,5,7]
  weekSales:number = 0;
  selectedMonth:number = -1;
  orders:Array<any>=[]
  constructor(public resolver:ResolverService, private activatedRoute:ActivatedRoute,private router:Router) {

   }
  ionViewWillEnter() {

  }
  ngOnInit() {
    this.getReports()

  }
  public getReports() {
    this.resolver.getOrders().toPromise().then((data:any[])=>{
        this.response = data;
        let sales = this.response.filter((item)=>this.allowSaleStatuses.includes(item.status))

        this.sales = sales;


        this.dashboardStats();
    })
  }

  public dashboardStats() {
    const reducer = (previous, current) =>{ 
      if(typeof previous=='object'){
        return parseFloat(previous.pricing.sellingPrice) + parseFloat(current.pricing.sellingPrice)
      } else {
        return parseFloat(previous) + parseFloat(current.pricing.sellingPrice)

      }
    };
    this.orders =  this.sales.filter((item)=>(item.created*1000)>=this.startDate.getTime()-WEEK)
    let total = this.orders.reduce(reducer,0);
    this.weekSales = total;
    if(typeof total=="object" && total.length) {
     this.weekSales = total.pricing.sellingPrice;
    }
  }

}
