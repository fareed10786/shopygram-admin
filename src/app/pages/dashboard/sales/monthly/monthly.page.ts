import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ResolverService } from 'src/app/services/resolver.service';
const YEAR = 31556952000
const MONTH = 2629746000
const WEEK = 604800000
const TODAY = 86400000
@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.page.html',
  styleUrls: ['./monthly.page.scss'],
})
export class MonthlyPage implements OnInit,ViewWillEnter {

  selectedSegment:number = 1;
  sales:Array<any>=[];

  response:Array<any>=[];
  startDate:Date = new Date();
  endDate:Date = new Date();
  allowSaleStatuses:Array<any>=[1,2,3,4,5,7]
  months:Array<string>=["January","February","March","April","May","June","July","August","September","October","November","December"];
  monthSales:Array<number>=[]
  selectedMonth:number = -1;
  orders:Array<any>=[]
  constructor(public resolver:ResolverService, private activatedRoute:ActivatedRoute,private router:Router) {

   }
  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe((data)=>{
      if(data.month) {
        this.selectedMonth = parseInt(data.month);
        this.getReports();

      } else {
        this.selectedMonth = -1;
        this.getReports();

      }
    })
  }
  ngOnInit() {


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
  
    if(this.selectedMonth==-1){
        this.months.forEach((item,index)=>{
          this.getMonthSales(index);
        });
    } else {
      this.getMonthSales(this.selectedMonth);
    }
  }
  public getMonthSales(index:number) {
    const reducer = (previous, current) =>{ 
      if(typeof previous=='object'){
        return parseFloat(previous.pricing.sellingPrice) + parseFloat(current.pricing.sellingPrice)
      } else {
        return parseFloat(previous) + parseFloat(current.pricing.sellingPrice)

      }
    };
    this.orders =  this.sales.filter((item)=>new Date(item.created*1000).getMonth()==index  && new Date(item.created*1000).getFullYear()==this.startDate.getFullYear());
    let total = this.orders.reduce(reducer,0);
    this.monthSales[index] = total;
    if(typeof total=="object" && total.length) {
     this.monthSales[index] = total.pricing.sellingPrice;
    }
  }
  public goToMonthSale(index:number) {
    this.router.navigate(['/dashboard/monthly'],{queryParams:{month:index}});
  }
}
