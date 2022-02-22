import { Component, OnInit } from '@angular/core';
import { ResolverService } from 'src/app/services/resolver.service';
const YEAR = 31556952000
const MONTH = 2629746000
const WEEK = 604800000
const TODAY = 86400000

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  selectedSegment:number = 1;
  sales:Array<any>=[];
  returns:Array<any>=[];
  stats:any={
    today:0,
    weekly:0,
    monthly:0,
    annual:0
  }
  response:Array<any>=[];
  startDate:Date = new Date();
  endDate:Date = new Date();
  year:number = 31536000;
  allowSaleStatuses:Array<any>=[7]
  allowReturnStatuses:Array<any>=[8,9]
  constructor(public resolver:ResolverService) {

   }

  ngOnInit() {
    this.getReports();
  }
  public getReports() {
    this.resolver.getOrders().toPromise().then((data:any[])=>{
      this.response = data;
      let sales = this.response.filter((item)=>this.allowSaleStatuses.includes(item.status))
      let returns = this.response.filter((item)=>this.allowReturnStatuses.includes(item.status))

      this.sales = sales;
      this.returns = returns;

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
    let today = this.sales.filter((item)=>item.created*1000>=this.startDate.getTime()-TODAY);
    let annual = this.sales.filter((item)=>(item.created*1000)>=this.startDate.getTime()-YEAR );
    let monthly = this.sales.filter((item)=>(item.created*1000)>=this.startDate.getTime()-MONTH );
    let weekly =  this.sales.filter((item)=>(item.created*1000)>=this.startDate.getTime()-WEEK)
    this.stats.today = today.reduce(reducer,0)
    this.stats.annual = annual.reduce(reducer,0)
    this.stats.monthly = monthly.reduce(reducer,0)
    this.stats.weekly = weekly.reduce(reducer,0)

    if(typeof this.stats.today=="object") {
      this.stats.today = this.stats.today.pricing.sellingPrice
    }
    if(typeof this.stats.annual=="object") {
      this.stats.annual = this.stats.today.pricing.annual
    }
    if(typeof this.stats.monthly=="object") {
      this.stats.monthly = this.stats.today.pricing.monthly
    }
    if(typeof this.stats.weekly=="object") {
      this.stats.weekly = this.stats.today.pricing.weekly
    }
    console.log(this.stats)
  }
}


