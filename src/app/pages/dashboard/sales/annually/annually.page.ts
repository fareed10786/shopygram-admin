import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-annually',
  templateUrl: './annually.page.html',
  styleUrls: ['./annually.page.scss'],
})
export class AnnuallyPage implements OnInit {

  selectedSegment:number = 1;
  sales:Array<any>=[];

  response:Array<any>=[];
  startDate:Date = new Date();
  endDate:Date = new Date();
  allowSaleStatuses:Array<any>=[1,2,3,4,5,7]
  yearSet:Set<number>=new Set();
  years:Array<number>=[];
  monthSales:Array<number>=[]
  selectedYear:number = -1;
  orders:Array<any>=[]
  constructor(public resolver:ResolverService, private activatedRoute:ActivatedRoute,private router:Router) {

   }
  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe((data)=>{
      if(data.year) {
        this.selectedYear = parseInt(data.year);
        this.getReports();

      } else {
        this.selectedYear = -1;
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
        this.sales.filter((item)=>{
          let year = new Date(item.created*1000).getFullYear();
          this.yearSet.add(year);
        })
        this.years = Array.from(this.yearSet)
        this.dashboardStats();
    })
  }

  public dashboardStats() {
  
    if(this.selectedYear==-1){
        this.years.forEach((item,index)=>{
          this.getYearSales(index);
        });
    } else {
      this.getYearSales(this.selectedYear);
    }
  }
  public getYearSales(index:number) {
    const reducer = (previous, current) =>{ 
      if(typeof previous=='object'){
        return parseFloat(previous.pricing.sellingPrice) + parseFloat(current.pricing.sellingPrice)
      } else {
        return parseFloat(previous) + parseFloat(current.pricing.sellingPrice)

      }
    };
    this.orders =  this.sales.filter((item)=> new Date(item.created*1000).getFullYear()==this.years[index]  );
    let total = this.orders.reduce(reducer,0);
    this.monthSales[index] = total;
    if(typeof total=="object" && total.length) {
     this.monthSales[index] = total.pricing.sellingPrice;
    }
  }
  public goToYearSale(index:number) {
    this.router.navigate(['/sg-admin/dashboard/annually'],{queryParams:{year:index}});
  }
}

