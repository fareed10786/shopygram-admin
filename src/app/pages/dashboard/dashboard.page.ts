import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgxDaterangepickerMd, DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ResolverService } from 'src/app/services/resolver.service';
import exportFromJSON from 'export-from-json'
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
  allowSaleStatuses:Array<any>=[1,2,3,4,5,7]
  allowReturnStatuses:Array<any>=[8,9];
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'Last 365 Days': [moment().subtract(365, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  selectedDate:any = {};
  totalOrders:Array<any>=[];
  @ViewChild("datePicker",{static:false})datePicker:NgxDaterangepickerMd;
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;

  constructor(public resolver:ResolverService) {

   }

  ngOnInit() {
    this.getReports();
  }
  public  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  public onDateChange(){
    if(this.selectedDate)
    {
      let startDate = new Date(this.selectedDate.startDate._d)
      let endDate = new Date(this.selectedDate.endDate._d)
      this.startDate = startDate;
      this.endDate = endDate;

      this.sales = this.totalOrders.filter((item)=>this.allowSaleStatuses.includes(item.status) && (item.created*1000)>=startDate.getTime() && (item.created*1000)<=endDate.getTime() )
      this.returns = this.totalOrders.filter((item)=>this.allowReturnStatuses.includes(item.status) && (item.created*1000)>=startDate.getTime() && (item.created*1000)<=endDate.getTime())
    }
  } 

  public getReports() {
    this.resolver.getOrders().toPromise().then((data:any[])=>{
      this.response = data;
      this.totalOrders = data;
      let sales = this.response.filter((item)=>this.allowSaleStatuses.includes(item.status))
      let returns = this.response.filter((item)=>this.allowReturnStatuses.includes(item.status))

      this.sales = sales;
      this.returns = returns;

      this.dashboardStats();
    })
  }

  public downloadReport() {
    let result = [];
    this.sales.forEach((item)=>{
      let sale = {
        "Order ID": item.orderId,
        "Sale Date": new Date(item.created*1000).toDateString(),
        "Earning":item.pricing.transferPrice
      }
      result.push(sale);
    })
    const data = result; 
    const fileName = `Sales_Report_${this.startDate}_${this.endDate}`
    const exportType =  exportFromJSON.types.csv
    exportFromJSON({ data, fileName, exportType })
    
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


