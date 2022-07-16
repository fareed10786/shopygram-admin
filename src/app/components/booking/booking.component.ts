import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSelectComponent } from 'ngx-select-ex';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BcryptService } from 'src/app/services/bcrypt.service';
import { ContactService } from 'src/app/services/contact.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { environment } from 'src/environments/environment';
import { SmrComponent } from '../smr/smr.component';

@Component({
  selector: 'booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {

  response: any;
  bookings: Array<any> = [];
  bookingsDesc:Array<any>=[];
  incoTerms: any = [];
  addressBook: any = [];
  shipmentModes: any = [];
  salesManagers: any = [];
  containerTypes: any = [];
  packageTypes: any = [];
  airports: any = [];
  airlines: any = [];
  shippinglines:any=[];
  seaports: any = [];
  branches:any = [];
  data: any = {};
  minCharSearch:number = 3;
  portPlaceholder:string = `(Minimum ${this.minCharSearch} characters)`
  recentlyUsedPorts: Array<any> = [];
  displayPorts: Array<any> = [];
  carriers: Array<any>=[];

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    scrollX: true,
    pageLength: 50,
  dom: 'frtlp',
    responsive:true,
    language: {
      search: "Search booking ID:",
      searchPlaceholder: "Booking ID",
      paginate: {
        next: '&#8594;', // or '→'
        previous: '&#8592;', // or '←' 
        first: '',
        last: ''
      },

    }
  };
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  @ViewChild("filter") filter: NgxSelectComponent
  @ViewChild("polfilter") polfilter: NgxSelectComponent

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
  bookingStatuses: Array<any> = [
    {
      name: "Opened",
      modes: [1, 2, 3, 4, 5]

    },
    {
      name: "Booked",
      modes: [1, 2, 3, 4, 5]

    },
    {
      name: "At Origin Port",
      modes: [3, 4, 5]
    },
    {
      name: "Picked Up",
      modes: [1, 2]

    },
    {
      name: "In Transit",
      modes: [1, 2, 3, 4, 5]

    },
    {
      name: "Vessel Arrived",
      modes: [2, 3, 4, 5]
    },
    {
      name: "Unloaded",
      modes: [4, 5]
    },
    {
      name: "Vessel Unloaded",
      modes: [3]

    },
    {
      name: "Container Unloaded",
      modes: [2]

    },
    {
      name: "Arrived",
      modes: [1]

    },
    {
      name: "Customs Cleared",
      modes: [1, 2, 3, 4, 5]

    },
    {
      name: "Available for Pickup/Delivery",
      modes: [2]
    },
    {
      name: "Released/Picked",
      modes: [3, 4, 5]

    },
    {
      name: "Delivered",
      modes: [3, 4, 5]

    },
    {
      name: "Delivered/Picked Up",
      modes: [1, 2]

    }
  ];
  statuses:Array<any>=[];
  keepSelectedItems:boolean = true;
  user:any={};
  @Input() type:string = "";
  @ViewChild("datePicker",{static:false})datePicker:NgxDaterangepickerMd;
  constructor(public bcrypt:BcryptService,public auth:AuthService,public contact: ContactService, private router: Router, public resolver: ResolverService, public controller: ControllersService) {
    this.user = this.auth.fetchUserProfile();
    this.data.branchId = this.auth.selectedBranch.id;
  }
  public getRolePermissions(feature: string, perm: number) {
    //  Read, Add, Edit , Delete
    return this.auth.getRolePermissions(feature,perm);
  }
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  ngOnInit() {
    if (window.localStorage.getItem('auth') == undefined) {
      window.open("/login", "_self");
    }
    this.getAllBookings();
    this.getContainerTypes();
    this.getPackageTypes();
    this.getIncoTerms();
    this.getAddressBook();
    this.getShipmentModes();
    this.getSalesExecList();
    this.getAirlines();
    this.getShippingLines();
    this.getSeaports();
    this.getAirports();
    this.getBranches();
  }
  public goToNewBooking() {
    window.open('/bookings/add', "_self");
  }
  public getBranches() {
    this.auth.userBranches().subscribe((data)=>this.response = data,
    (err)=>console.warn(err),
    ()=>{
      this.branches = this.response;
      console.log(this.branches)
    });
  }
  public getAllBookings() {

    let endpoint = this.type=="active"?this.resolver.getActiveBookings():this.resolver.applyFilter(JSON.stringify(this.data),this.type);
    endpoint.toPromise().then((data) => {
      this.response = data
      this.bookings = this.response;
      this.bookingsDesc = this.bookings.reverse();
      this.dtTrigger.next();
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
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
  public exportBookingListExcel() {
    this.controller.presentLoading("Preparing excel...");
    let filter = JSON.stringify(this.data)
    this.resolver.exportBookingExcel(filter).toPromise().then((response:any)=>{
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        
          downloadLink.setAttribute('download', `bookinglist`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
    })
    //window.open(`${environment.apiURL}/bookings/export?filter=${filter}`, '_blank')
  }
  downloadFile(data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  public getIncoTerms() {
    this.resolver.getIncoterms().subscribe((data) => {
      this.response = data;
      this.incoTerms.push(...this.response);
    });
  }
  public getAddressBook() {
    this.contact.getCustomerList().subscribe((data) => {
      this.response = data;
      this.addressBook.push(...this.response);
    });
  }

  public getShipmentModes() {
    this.resolver.getShipmentModes().subscribe((data) => {
      this.response = data;
      this.shipmentModes.push(...this.response);
    })
  }

  public getSalesExecList() {
    this.auth.multiRoles([3,4]).subscribe((data) => {
      this.response = data;
      this.salesManagers.push(...this.response);
      this.salesManagers.forEach((item) => {
        item.name = item.firstName + " " + item.lastName;
      })
    })
  }


  public getContainerTypes() {
    this.resolver.getContainerTypes().subscribe((data) => {
      this.response = data;
      this.containerTypes.push(... this.response);
    })
  }

  public getPackageTypes() {
    this.resolver.getPackageTypes().subscribe((data) => {
      this.response = data;
      this.packageTypes.push(... this.response);
    })
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

  public getAirlines() {
    this.resolver.getAirlines().subscribe((data) => {
      this.response = data;
      this.airlines.push(... this.response);
      this.airlines.forEach((item) => {
        item.name = item.code + " - " + item.name;
      })
    })
  }

  public getShippingLines() {
    this.resolver.getShippingLines().subscribe((data) => {
      this.response = data;
      this.shippinglines.push(... this.response);
      this.shippinglines.forEach((item) => {
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

  public setStatusForShipmentMode() {
    this.statuses = this.bookingStatuses.filter(item=>item.modes.includes(this.data.shipmentmodeId));
  }
  public onItemSelection() {

    this.displayPorts = this.recentlyUsedPorts;
  }
  public onShipmentModeChange() {
    let recentlyUsedPorts = new Set();
    let result = [];
    if(this.data.shipmentmodeId==1) {
      this.carriers = this.airlines
      this.minCharSearch = 3;
    } else {
      this.minCharSearch = 5;
      this.carriers = this.shippinglines
    }
    this.portPlaceholder = `(Minimum ${this.minCharSearch} characters)`
    this.bookingsDesc.forEach((item) => {
      if (item.routing.origin) {
        if (this.data.shipmentmodeId == 1) {
          if (item.routing.origin.airport) {
            let port = item.routing.origin.airport
            if (recentlyUsedPorts.size < 5) {
              recentlyUsedPorts.add(port.id);
            }
          }
        }
        else {
          if (item.routing.origin.seaport) {
            let port = item.routing.origin.seaport
            if (recentlyUsedPorts.size < 5) {
              recentlyUsedPorts.add(port.id);
            }
          }
        }
      }
    })

    let portList = (this.data.shipmentmodeId == 1 ? this.airports : this.seaports);
    recentlyUsedPorts.forEach((portId) => {
      let port = portList.filter(item => item.id == portId)[0];
      if (port) {
        result.push(port)
      }
    })
    this.recentlyUsedPorts = result;
    this.displayPorts = this.recentlyUsedPorts;
    this.setStatusForShipmentMode();
  }
  public applyFilter() {
    let filter = JSON.stringify(this.data)
    this.controller.presentLoading("Searching based on filters....");
    this.resolver.applyFilter(filter,this.type).subscribe((data) => {
      this.response = data;
      this.bookings = [];
      this.bookings = this.response;
      this.keepSelectedItems = true;

      this.rerender()

      this.controller.loadCtrl.dismiss();
    })
  }

  public resetFilter() {
    this.data = {};
    this.data.branchId = this.auth.selectedBranch;
   // this.datePicker.
   this.keepSelectedItems = false;
    this.applyFilter();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  async openSMR() {
    const modal = await this.controller.modalCtrl.create({
      component: SmrComponent,
      cssClass: 'my-custom-class',
      componentProps:{
        customers:this.addressBook
      }
    });
    return await modal.present();
  }

}
