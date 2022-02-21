import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { Booking, cargoExtrainfo, cargoLoads } from '../interfaces/booking';
import { AuthService } from '../services/auth.service';
import { ContactService } from '../services/contact.service';
import { ControllersService } from '../services/controllers.service';
import { ResolverService } from '../services/resolver.service';
import { WorkSheet, WorkBook, utils, writeFile } from 'xlsx';
import { ContactComponent } from '../components/contact/contact.component';
import { EmailComponent } from '../components/email/email.component';
import { environment } from 'src/environments/environment';
const INCH = 0.393701
const CHARGE = 167
@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

  charge: number = CHARGE
  bookingForm: FormGroup
  fclForm: FormGroup
  lclForm: FormGroup
  airForm: FormGroup
  originForm: FormGroup
  destinationForm: FormGroup
  otherInfo: any = {
    emailRecipients: "",
    emailBody: ""
  }
  totalBookingForm: Partial<Booking> = {};
  cargoDetails: Partial<cargoLoads> = {};
  cargoLoads: Array<Partial<cargoLoads>> = [];
  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(10));
  public fileUploadForm = new FormGroup({
    files: this.filesControl
  });
  incoTerms: Array<any> = [];
  shipmentModes: Array<any> = [];
  addressBook: Array<any> = [];
  response: any = {};
  minCharSearch: number = 3;
  portPlaceholder: string = `(Minimum ${this.minCharSearch} characters)`
  cargoExtrainfo: cargoExtrainfo = {
    eta: '',
    etd: '',
    vessel: '',
    voyage: '',
    containerNumber:"",
    hblNumber: "",
    flightNumber: '',
    coLoader: '',
    mblNumber: "",
    awbNumber:"" ,
    insurance: 0,
    quoteNumber: 0,
    freightJobNumber: "",
    internalNote: '',
    externalNote: '',
    freehand: 0
  }

  saleExecutives: Array<any> = [];

  containerTypes: Array<any> = [];
  packageTypes: Array<any> = [];
  locationTypes: Array<any> = [];

  airports: Array<any> = [];
  airlines: Array<any> = [];
  shippinglines: Array<any> = [];

  seaports: Array<any> = [];

  fclLoadDetails: Array<any> = [];
  lclLoadDetails: Array<any> = [];
  airLoadDetails: Array<any> = [];

  cargoLoadDetails: Array<any> = [];
  bid: number;
  routeVal: any;

  lengthConst: number = 1;

  bookings: Array<any> = [];
  bookingsDesc: Array<any> = [];

  recentlyUsedPorts: Array<any> = [];
  displayPorts: Array<any> = [];

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

  selectedCustomerEmail: string = "";
  user: any = {}
  suggestions: any;
  search = "";
  url = `${environment.apiURL}/geocoding`;
  params = {
    search: this.search,
  };

  branchId:number = 0;
  constructor(private activatedRoute: ActivatedRoute, public controller: ControllersService, private fb: FormBuilder, public auth: AuthService, public contact: ContactService, public resolver: ResolverService, private router: Router) {
    this.routeVal = this.activatedRoute.snapshot.paramMap.get('bid').toString();
    this.bid = parseInt(this.routeVal);
    this.totalBookingForm.cargofiles = [];
    this.totalBookingForm.statusText = "Opened";
    this.user = this.auth.fetchUserProfile()
    this.bookingForm = this.fb.group({
      uniqueId: ['', [Validators.required]],
      customerId: [null, [Validators.required]],
      shipperId: [null, [Validators.required]],
      shipmentmodeId: ['', [Validators.required]],
      consigneeId: [null, [Validators.required]],
      salesexecutiveId: [null, [Validators.required]],
      incotermId: [null, [Validators.required]],
      agentId: [null, [Validators.required]],
      customerPo: [null, [Validators.required]],
      carrier: [null, [Validators.required]],
    });



    this.originForm = this.fb.group({
      pickupDate: ['', [Validators.required]],
      readyDate: ['', [Validators.required]],

      location: ['', [Validators.required]],
   //   pincode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      locationtypeId: ['', [Validators.required]],
      airportId: [0],
      seaportId: [0],

    })

    this.destinationForm = this.fb.group({
      location: ['', [Validators.required]],
     // pincode: ['', [Validators.required, Validators.pattern('[0-9]')]],
      address: ['', [Validators.required]],
      locationtypeId: ['', [Validators.required]],
      airportId: [0],
      seaportId: [0],

    })


    if (!isNaN(this.bid)) {
      this.getBooking();
    } else {
      this.totalBookingForm.shipmentmodeId = 1;
      this.getAddressBook();

      this.addCargoDetails(true)
    }
    this.branchId = this.auth.selectedBranch.id;
    this.otherInfo.branchId = this.branchId;
  }

  ngOnInit() {
    if (window.localStorage.getItem('auth') == undefined) {
      window.open("/login", "_self");
    }

    this.controller.presentLoading("Loading background data...")
    if (this.routeVal == "add") {
      this.generateBookingId();
    }
    this.getContainerTypes();
    this.getPackageTypes();
    this.getLocationTypes();
    this.getIncoTerms();
    this.getShipmentModes();
    this.getSalesExecList();

    this.getSeaports();
    this.getAirports();
    this.getAirlines();
    this.getShippingLines();
    this.getAllBookings();
  }
  public updateBookingStatus(status: string) {
    this.totalBookingForm.statusText = status;
    this.statusConfirmation(status);
  }
  public getLocationTypes() {
    this.resolver.getLocationTypes().subscribe((data) => {
      this.response = data,
        this.locationTypes.push(...this.response);
    })
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
      this.addressBook = this.response;
      this.setCustomerEmail(this.totalBookingForm.customerId);

    });
  }

  public getShipmentModes() {
    this.resolver.getShipmentModes().subscribe((data) => {
      this.response = data;
      this.shipmentModes.push(...this.response);
    })
  }

  public getSalesExecList() {
    this.auth.multiRoles([3, 4]).subscribe((data) => {
      this.response = data;
      this.saleExecutives.push(...this.response);
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

  public getSeaports() {
    this.resolver.getSeaports().subscribe((data) => {
      this.response = data;
      this.seaports.push(... this.response);
      this.seaports.forEach((item) => {
        item.name = item.code + " - " + item.name;
      })
    })
  }

  public getAllBookings() {
    this.resolver.getBooking().toPromise().then((data) => {
      this.response = data
      this.bookings = this.response;
      this.bookingsDesc = this.bookings.reverse();
      this.onShipmentModeChange();

    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }

  public searchList(value: string) {
    let searchItem = value.toLowerCase();
    if (searchItem.length >= this.minCharSearch) {
      if (searchItem) {
        let result = this.displayPorts.filter(item => item.name.toLowerCase().includes(searchItem))
        if (!result.length) {
          this.displayPorts = (this.totalBookingForm.shipmentmodeId == 1 ? this.airports : this.seaports).filter(item => item.name.toLowerCase().includes(searchItem));
        }
      }
    } else {
      this.displayPorts = this.recentlyUsedPorts
    }
  }

  public onShipmentModeChange() {
    let recentlyUsedPorts = new Set();
    let result = [];
    if (this.totalBookingForm.shipmentmodeId == 1) {
      this.minCharSearch = 3;
    } else {
      this.minCharSearch = 5;
    }
    this.portPlaceholder = `(Minimum ${this.minCharSearch} characters)`
    this.bookingsDesc.forEach((item) => {
      if (item.routing.origin) {
        if (this.totalBookingForm.shipmentmodeId == 1) {
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

    if (this.bid) {
      if (this.totalBookingForm.shipmentmodeId == 1) {
        recentlyUsedPorts.add(this.totalBookingForm.routing.origin.airportId)
        recentlyUsedPorts.add(this.totalBookingForm.routing.destination.airportId)

      }
      else {
        recentlyUsedPorts.add(this.totalBookingForm.routing.origin.seaportId)
        recentlyUsedPorts.add(this.totalBookingForm.routing.destination.seaportId)

      }
    }
    let portList = (this.totalBookingForm.shipmentmodeId == 1 ? this.airports : this.seaports);
    recentlyUsedPorts.forEach((portId) => {
      let port = portList.filter(item => item.id == portId)[0];
      if (port) {
        result.push(port)
      }
    })

    this.recentlyUsedPorts = result;
    this.displayPorts = this.recentlyUsedPorts;

  }

  public generateBookingId() {
    this.resolver.generateBookingId().subscribe((data) => {
      this.response = data;
      this.totalBookingForm.uniqueId = this.response;
    })
  }

  public addFclDetails() {
    this.fclLoadDetails.push(this.fclForm.value)
    this.fclForm.reset();
  }

  public addLclDetails() {
    this.fclLoadDetails.push(this.lclForm.value)
    this.lclForm.reset()
  }

  public addAirDetails() {
    this.fclLoadDetails.push(this.airForm.value)
    this.airForm.reset();
  }


  public removeCargoDetails(pos: number) {
    this.cargoLoads.splice(pos, 1);
  }
  public loadSpecificCargoDetails(targetArray: Array<any>, dataForm: FormGroup, add: boolean = false) {

    if (add || targetArray.length == 0) {
      targetArray.push(dataForm)
    }

  }
  public addCargoDetails(add: boolean = false) {

    if (!add) {
      this.cargoLoads = [];
    }
    this.cargoDetails.lengthUnit = 1;
    this.cargoDetails.weightUnit = 1;
    let obj = Object.assign({}, this.cargoDetails);
    this.cargoLoads.push(obj);
    this.onShipmentModeChange()
  }

  public onLengthUnitChange(data) {
    let lengthConst = 1;
    if (data.lengthUnit == 2) {
      lengthConst = INCH
    }
    data.cbm = ((data.length * data.width * data.height * Math.pow(lengthConst, 3))) / 1000000;

    data.totalCbm = (data.cbm * data.quantity)

    this.calculateChargeableWeight(data)
  }
  public calculateChargeableWeight(data) {
    data.totalWeight = data.quantity * data.perPackageWeight
    data.chargeableWeight = parseFloat(data.totalCbm) * CHARGE;
    data.chargeableWeight = data.chargeableWeight > data.totalWeight ? data.chargeableWeight : data.totalWeight
  }
  get shipmentMode() {
    return this.bookingForm.get('shipmentmodeId')
  }
  public onItemSelection() {
    this.displayPorts = this.recentlyUsedPorts;
  }
  public getBooking() {
    this.controller.presentLoading("Fetching booking...");
    this.resolver.getBookingById(this.bid).toPromise().then((data: Booking) => {
      this.response = data
      this.totalBookingForm = data;
      this.cargoLoads = data.cargoloads;
      this.getAddressBook();
      if (data.cargoExtrainfo) {
        this.cargoExtrainfo = data.cargoExtrainfo
        this.cargoExtrainfo.freehand = this.cargoExtrainfo.freehand ? true : false;

        console.log(this.cargoExtrainfo)
      }
      this.originForm.get('airportId').setValue(data.routing.origin.airportId);
      this.originForm.get('seaportId').setValue(data.routing.origin.seaportId ?? 0);
      this.originForm.get('locationtypeId').setValue(data.routing.origin.locationtypeId);
      this.originForm.get('location').setValue(data.routing.origin.location);
      this.originForm.get('pickupDate').setValue(data.routing.origin.pickupDate);
    //  this.originForm.get('pincode').setValue(data.routing.origin.pincode);
      this.originForm.get('address').setValue(data.routing.origin.address);
      this.originForm.get('readyDate').setValue(data.routing.origin.readyDate)
      this.destinationForm.get('airportId').setValue(data.routing.destination.airportId);
      this.destinationForm.get('seaportId').setValue(data.routing.destination.seaportId ?? 0);
      this.destinationForm.get('locationtypeId').setValue(data.routing.destination.locationtypeId);
      this.destinationForm.get('location').setValue(data.routing.destination.location);
     // this.destinationForm.get('pincode').setValue(data.routing.destination.pincode);
      this.destinationForm.get('address').setValue(data.routing.destination.address);
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public saveBooking() {

    let finalBookingForm = this.totalBookingForm;
    if (!finalBookingForm.customerPo) {
      finalBookingForm.customerPo = "";
    }

    this.cargoLoads.forEach((item) => {
      let keys = Object.keys(item);

      for (let i = 0; i < keys.length; i++) {

        item[keys[i]] = item[keys[i]] != null ? item[keys[i]] : 0
      }
      if(!item.containerNumber) {
        item.containerNumber = "";
      } 
      
      if (item.chargeableWeight == null || !item.chargeableWeight) {
        item.chargeableWeight = 0;
      }
      if (item.totalWeight == null || !item.totalWeight) {
        item.totalWeight = 0;
      }
      if (!item.additionalInformation) {
        item.additionalInformation = "";
      }
      if (item.packagetypeId)
        item.packagetypeId = parseInt(item.packagetypeId.toString());
      if (item.containertypeId)
        item.containertypeId = parseInt(item.containertypeId.toString());
      if (item.lengthUnit)
        item.lengthUnit = parseInt(item.lengthUnit.toString());
      if (item.weightUnit)
        item.weightUnit = parseInt(item.weightUnit.toString());
    })
    finalBookingForm.cargoloads = this.cargoLoads;
    finalBookingForm.routing = { origin: {}, destination: {} }

    finalBookingForm.routing.origin = this.originForm.value;


    finalBookingForm.routing.destination = this.destinationForm.value;

    if (finalBookingForm.shipmentmodeId == 1) {
      delete finalBookingForm.routing.destination.seaportId
      delete finalBookingForm.routing.origin.seaportId
    }
    if (typeof this.cargoExtrainfo.freehand == 'boolean') {
      this.cargoExtrainfo.freehand = this.cargoExtrainfo.freehand ? 1 : 0;
    }
    finalBookingForm.cargoExtrainfo = this.cargoExtrainfo;
    Object.assign(finalBookingForm, this.otherInfo);

    if (this.bid) {
      //this.exportBooking(finalBookingForm)
      this.updateBookingImpl(finalBookingForm);
    }
    else {
      this.saveBookingImpl(finalBookingForm);
    }
    // this.exportBooking(finalBookingForm)


  }

  public updateBookingImpl(finalBookingForm) {
    this.controller.presentLoading("Updating booking...");
    this.resolver.updateBookingById(this.bid, finalBookingForm).toPromise().then((data) => {
      this.response = data
      this.showBookingConfirmation();
    }).catch((err) => {
      this.controller.presentAlert(err.err.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public saveBookingImpl(finalBookingForm) {
    this.controller.presentLoading("Saving booking...");
    this.resolver.saveBooking(finalBookingForm).toPromise().then((data) => {
      this.response = data
      this.bid = this.response.id;
      this.showBookingConfirmation();

    }).catch((err) => {
      this.controller.presentAlert(err.err.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }

  public uploadFileImpl() {
    let files = this.fileUploadForm.get('files').value;
    files.forEach(file => {
      this.uploadFile(file);
    });
  }
  public uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file)
    this.controller.presentLoading("Uploading file...");
    this.resolver.fileUpload(formData).toPromise().then((data) => {
      this.response = data;

      console.log("####FILE UPLOADED####")
      this.totalBookingForm.cargofiles.push(this.response.filename);
      console.log(this.response.filename)
      this.controller.presentToast("File has been successfully uploaded.");
      //  this.companyDetailsOthers.document = this.response.filename;
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message);
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public exportBooking(dataForm) {
    const workSheet: WorkSheet = utils.json_to_sheet(dataForm.cargoloads);
    const workBook: WorkBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, 'object_to_save');
    writeFile(workBook, 'Tests.xlsx');
  }

  public onShow() {
    //this.controller.presentAlert("Sa")
  }
  async openEmailComp(status?: string, showDateTime: boolean = false) {
    const modal = await this.controller.modalCtrl.create({
      component: EmailComponent,
      cssClass: 'full-modal-wrapper',
      componentProps: {
        customerEmail: this.selectedCustomerEmail,
        bookingId: this.totalBookingForm.uniqueId,
        showDateTime: showDateTime,
        status: status
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data.emailRecipients) {
        this.otherInfo = data.data;
        this.otherInfo.sendEmail = 1;
        this.saveBooking();
      }
    })
    return await modal.present();
  }

  async openNewContact() {
    const modal = await this.controller.modalCtrl.create({
      component: ContactComponent,
      cssClass: 'full-modal-wrapper',
    });
    modal.onDidDismiss().then((data) => {
      if (data.data.refresh) {
        this.controller.presentLoading("Refreshing addressbook", 1000);
        this.getAddressBook();
      }
    })
    return await modal.present();
  }
  async showBookingConfirmation() {
    const alert = await this.controller.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Booking saved',
      mode: 'ios',
      message: 'The booking has been successfully saved',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Download PDF',
          handler: () => {
            this.exportBookingPDF();
          }
        }
      ]
    });

    await alert.present();
  }

  public exportBookingPDF() {
    // window.open(`${environment.apiURL}/bookings/${this.bid}/export/pdf`)
    this.resolver.exportBookingPDF(this.bid).toPromise().then((response: any) => {
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

      downloadLink.setAttribute('download', `${this.totalBookingForm.uniqueId}`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  public setCustomerEmail(event) {
    let customer = this.addressBook.filter(item => item.id == event)[0]
    this.selectedCustomerEmail = customer.contacts[0].email
  }
  public async deleteConfirmation() {
    const alert = await this.controller.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm deletion',
      mode: 'ios',
      message: 'Are you sure you want to delete this job?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteJob()
          }
        }
      ]
    });

    await alert.present();
  }
  public deleteJob() {
    this.controller.presentLoading("Deleting job...");
    this.resolver.deleteJob(this.bid).toPromise().then((data) => {
      this.controller.presentAlert("The job has been successfully deleted");
      window.open("/bookings", "_self")
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }

  async statusConfirmation(status: string) {
    const alert = await this.controller.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Notify customer',
      mode: 'ios',
      message: 'Do you want to notify the customer as well?',
      buttons: [
        {
          text: 'Update only',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.saveBooking();
          }
        }, {
          text: 'Notify customer',
          handler: () => {
            this.openEmailComp(status, true)
          }
        }
      ]
    });

    await alert.present();
  }

  public startMapSuggestions(event) {
    let place = event;
    if (place.length >= 3) {
      this.getMapSuggestions(place);
    }
  }
  public getMapSuggestions(place: string) {
    this.resolver.getMapSuggestions(place).toPromise().then((data: any) => {
      this.suggestions = data.features;
      //  console.log(this.suggestions)
    })
  }
  public getRolePermissions(feature: string, perm: number) {
    //  Read, Add, Edit , Delete
    return this.auth.getRolePermissions(feature,perm);
  }
}

