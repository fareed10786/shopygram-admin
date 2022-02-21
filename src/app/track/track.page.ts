import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ControllersService } from '../services/controllers.service';
import { ResolverService } from '../services/resolver.service';


@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {

  LOAD = "Loaded"
  DISC = "Discharged"
  GTIN = "Gated in"
  GTOT = "Gated out"
  STUF = "Stuffed"
  STRP = "Stripped"
  PICK = "Pick-up"
  DROP = "Drop-off"
  RSEA = "Resealed"
  RMVD = "Removed"
  INSP = "Inspected"


  requestBodies = [
    {
      name: "COSCO",
      body:
      {
        "bookingNumber": "",
        "billOfLadingNumber": "",
        "cntrNumber": ""
      },
      options: [
        {
          value: "bookingNumber", name: "Booking Number",
        },
        {
          value: "billOfLadingNumber", name: "Bill Of Lading"
        },
        {
          value: "cntrNumber", name: "Container Number"
        }
      ]
    },
    {
      name: "Maersk",
      body:
      {
      
        "transportDocumentReference": "",

      },
      options: [
        {
          value: "carrierBookingReference", name: "Booking Number",
        },
        {
          value: "transportDocumentReference", name: "Bill of Lading"
        },
        {
          value: "equipmentReference", name: "Container number"
        }
      ]
    },
    {
      name: "MSC",
      body:
      {
        "bookingReference": "",
        "billOfLadingNumber": "",
        "equipmentReference": ""
      },
      options: [
        {
          value: "bookingReference", name: "Booking Number",
        },
        {
          value: "billOfLadingNumber", name: "Bill Of Lading"
        },
        {
          value: "equipmentReference", name: "Container Number"
        },
        
      ]
    }
  ];

  carriers: Array<string> = ["COSCO","Maersk","MSC"];
  selectedCarrier: number = 0;
  selectedOption: number = 0;
  searchType: any = {
    value: "bookingNumber", name: "Booking Number",
  };
  data: any;
  response: any;
  events: Array<any> = [];
  shipmentSummary: Array<any> = [];
  
  mscToken:string = "";
  constructor(public resolver: ResolverService, public controller: ControllersService) {
   }

  ngOnInit() {
  }
  public getTrackingDetails() {
    this.events = [];
    if(this.selectedCarrier==0) {
      this.getCoscoTrackingDetails();
    }
    if(this.selectedCarrier==1) {
      this.getMaerskTrackingDetails();
    }
    if(this.selectedCarrier==2) {
      this.getMSCTrackingDetails();
    }
  }
  public getMaerskTrackingDetails() {
    let transportDR = this.requestBodies[this.selectedCarrier].body.transportDocumentReference;
    if(transportDR) {
      this.requestBodies[this.selectedCarrier].body.transportDocumentReference = transportDR;
    }
    this.controller.presentLoading("Searching for details...");
    this.resolver.getMaerskTrackAndTrace(this.requestBodies[this.selectedCarrier].body).subscribe((data) => this.response = data,
      (err) => console.log(err),
      () => {
        this.controller.loadCtrl.dismiss();
        this.data = this.response;
        this.events = this.response.events.reverse();
       
      })
  }
  public getCoscoTrackingDetails() {
    this.controller.presentLoading("Searching for details...");
    this.resolver.getCOSCOTrackAndTrace(this.requestBodies[this.selectedCarrier].body).subscribe((data) => this.response = data,
      (err) => console.log(err),
      () => {
        this.controller.loadCtrl.dismiss();
        this.data = JSON.parse(this.response.shipmentContent);
        if (this.searchType.value == "cntrNumber") {
          this.events = [this.data.containerDetail];
        } else {
          this.events = this.data.containerDetail;
        }
        this.shipmentSummary = this.data.shipmentSummary
      })
  }

  public getMSCTrackingDetails() {
    this.controller.presentLoading("Searching for details...");
    let transportDR = this.requestBodies[this.selectedCarrier].body.transportDocumentReference;
    if(transportDR) {
      this.requestBodies[this.selectedCarrier].body.transportDocumentReference = transportDR;
    }
    this.resolver.getMSCTrackAndTrace(this.requestBodies[this.selectedCarrier].body).subscribe((data) => this.response = data,
      (err) => console.log(err),
      () => {
        this.controller.loadCtrl.dismiss();
        this.data = this.response.events;
        this.events = this.data.filter(item=>item.eventType=="EQUIPMENT");;
     
      })
  }

  public onCarrierChange() {
    this.onSearchTypeSelection()
  }
  onSearchTypeSelection(event?) {

    if(event){
      console.log(event.target.value)
       this.selectedOption = event.target.value;
    }
    else {
      this.selectedOption = 0
      console.log(this.selectedCarrier+" "+this.selectedOption)

    }
    this.searchType = {};
    let keys =  Object.keys(this.requestBodies[this.selectedCarrier].body)
    keys.forEach((key)=>{
     this.requestBodies[this.selectedCarrier].body[key]=""
    })
 
    this.searchType = this.requestBodies[this.selectedCarrier].options[this.selectedOption];
    console.log("###SEARCH TYPE###")
    console.log(this.searchType)
  }

  public maerskEventIdentifier(eventType) {
    return this[eventType]??eventType
  }
}
