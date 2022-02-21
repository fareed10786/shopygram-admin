import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartjsComponent } from '@ctrl/ngx-chartjs';
import { ChartData, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSelectComponent } from 'ngx-select-ex';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-port-performance',
  templateUrl: './port-performance.component.html',
  styleUrls: ['./port-performance.component.scss'],
})
export class PortPerformanceComponent implements OnInit {

  bookings: Array<any> = [];
  shipmentModes: any = [];
  airports: any = [];
  seaports: any = [];
  @ViewChild("filter") filter: NgxSelectComponent
  @ViewChild("polfilter") polfilter: NgxSelectComponent
  data: any = {};
  minCharSearch:number = 3;
  portPlaceholder:string = `(Minimum ${this.minCharSearch} characters)`
  recentlyUsedPorts: Array<any> = [];
  displayPorts: Array<any> = [];
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
  selectedDate:any;
  response:any;
  keepSelectedItems:boolean = true;
  @ViewChild("datePicker",{static:false})datePicker:NgxDaterangepickerMd;
  portData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'Air',
        data: [],
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        
        ],
        borderColor: [
          'rgb(255, 99, 132)',
        
        ],
        borderWidth: 1,
      },
      {
        label: 'FCL',
        data: [],
        fill: false,
        backgroundColor: [
         
          'rgba(75, 192, 192, 0.2)',
    
        ],
        borderColor: [
       
          'rgb(75, 192, 192)',
  
        ],
        borderWidth: 1,
      }
    ],
  };
  options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ports',
      },
    },
  };
  @ViewChild(ChartjsComponent) chart:ChartjsComponent
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {

    this.getShipmentModes();

    this.getSeaports();
    this.getAirports();

  }
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  public getAirports() {
    this.resolver.getAirports().subscribe((data) => {
      this.response = data;
      this.airports.push(... this.response);
      this.airports.forEach((item) => {
        item.name = item.code + " - " + item.name;
      })
      this.controller.loadCtrl.dismiss();

    })
  }
  public getSeaports() {
    this.resolver.getSeaports().subscribe((data) => {
      this.response = data;
      this.seaports.push(... this.response);
      this.seaports.forEach((item) => {
        item.name = item.code + " - " + item.name;
      })
    })
  }
  public searchList(value:string) {
    console.log(value)
    let searchItem = value.toLowerCase();
    if(searchItem.length>=this.minCharSearch) {
        if(searchItem)
        {
          let result = this.displayPorts.filter(item=>item.name.toLowerCase().includes(searchItem))
          if(!result.length) {
            this.displayPorts = (this.data.shipmentmodeId==1?this.airports:this.seaports).filter(item=> item.name.toLowerCase().includes(searchItem));
          }
        }
       } else {
          this.displayPorts = this.recentlyUsedPorts
        }
 
   // console.log(this.displayPorts)
  }


  public onItemSelection() {

    this.displayPorts = this.recentlyUsedPorts;
  }
  public onShipmentModeChange() {
    let recentlyUsedPorts = new Set();
    let result = [];
    if(this.data.shipmentmodeId==1) {
      this.minCharSearch = 3;
    } else {
      this.minCharSearch = 5;
    }
    this.portPlaceholder = `(Minimum ${this.minCharSearch} characters)`

    let portList = (this.data.shipmentmodeId == 1 ? this.airports : this.seaports);
    result = portList.slice(0,5);
    this.recentlyUsedPorts = result;
    this.displayPorts = this.recentlyUsedPorts;
  }
  public getShipmentModes() {
    this.resolver.getShipmentModes().subscribe((data) => {
      this.response = data;
      this.shipmentModes.push(...this.response);
    })
  }

  public applyFilter() {
    let data = {
      shipmentmodeId:this.data.shipmentmodeId,
      portOne:this.data.pol,
      portTwo:this.data.pod,
      startDate:this.data.startDate,
      endDate:this.data.endDate
    }
    let filter = JSON.stringify(data)
    this.controller.presentLoading("Searching based on filters....");
    this.getPortPerformance(filter);
  }

  public resetFilter() {
    this.data = {};
   // this.datePicker.
   this.keepSelectedItems = false;
    this.applyFilter();
  }

  public onDateChange(){
    if(this.selectedDate)
    {
      let startDate = new Date(this.selectedDate.startDate._d).toISOString().split('T')[0];
      let endDate = new Date(this.selectedDate.endDate._d).toISOString().split('T')[0];
      
      this.data.startDate = startDate;
      this.data.endDate = endDate;

    }
  } 
  
  public getPortPerformance(filter:string) {
    this.resolver.portPerformance(filter).toPromise().then((data:any)=>{
      let result = []
      this.portData.datasets.forEach((item,index)=>{
        let port = "";
        if(index==0) {
          port = "portOne"
        }else {
          port = "portTwo"
        }
        item.data = [data[port].totalBooking];
        item.label = data[port].name;
      })
      this.portData.labels = ["Port performance"]
      console.log(this.portData)
      this.chart.updateChart()
    })
  }
}
