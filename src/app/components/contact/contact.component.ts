import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'contact-panel',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  companyDetailsForm: FormGroup;
  companyDetailsOthers: any = {
    contactSegment: 1,
    document:''
  };

  primaryContact: FormGroup;
  addressForm: FormGroup;
  accountingContact: any = {};

  customerId: number = 0;
  response: any;
  otherContacts: Array<any> = [];
  type: any;
  mode:number = 0 //new;
  customerGetDetails: any ={}
  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(1));
    public fileUploadForm = new FormGroup({
        files: this.filesControl
    });
  suggestions: any;
  branchId:number = 0;
  constructor(public resolver:ResolverService,private activatedRoute: ActivatedRoute, public contact: ContactService, private modalCtrl: ModalController, public controller: ControllersService, public auth: AuthService, public formBuilder: FormBuilder) {
    this.type = parseInt(this.activatedRoute.snapshot.paramMap.get('type'));
    this.branchId = this.auth.selectedBranch.id;
    this.companyDetailsForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      code: ['', [Validators.required]],
      notes: [''],
    });

    this.primaryContact = this.formBuilder.group({
      designation:['', [Validators.required, Validators.pattern('[A-Za-z./]{3,}')]],
      name: ['', [Validators.required, Validators.pattern('[A-Za-z ]{3,}')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      contactType: [1],
      
    })

    this.addressForm = this.formBuilder.group({
      lineOne: ['', [Validators.required, Validators.pattern("[A-Za-z0-9.,'/ ]{5,}")]],
      lineTwo: ['', [Validators.required, Validators.pattern("[A-Za-z0-9.,'/ ]{5,}")]],

      city: ['', [Validators.required, Validators.pattern("[A-Za-z.,' ]{3,}")]],
      cityUnCode: ['', [Validators.required]],
      pincode: ['', [Validators.required]],

    });

    this.accountingContact = {
      designation:"",
      email: "",
      phoneNumber: "",
      name: "",
      contactType: 3
    }
    if (isNaN(this.type)) {
      this.otherContacts.push(this.accountingContact);

    }
    else {
      this.customerId = this.type;
      this.mode = 1;
      this.getCustomerDetails();
    }

  }
  public getCustomerDetails() {

    this.controller.presentLoading("Fetching customer details...");
    this.contact.getCustomerById(this.customerId).toPromise().then((data) => {
      this.customerGetDetails = data;
      this.response = data;
      this.companyDetailsForm.get('companyName').setValue(this.response.companyName);
      this.companyDetailsForm.get('phoneNumber').setValue(this.response.phoneNumber);
      this.companyDetailsForm.get('code').setValue(this.response.code);
      this.companyDetailsForm.get('notes').setValue(this.response.notes);
      this.companyDetailsOthers.contactSegment = this.response.contactSegment;
      this.companyDetailsOthers.document = this.response.document??"";

      if(this.response.address) {
        this.addressForm.get('lineOne').setValue(this.response.address.lineOne);
        this.addressForm.get('lineTwo').setValue(this.response.address.lineTwo);
        this.addressForm.get('city').setValue(this.response.address.city);
        this.addressForm.get('cityUnCode').setValue(this.response.address.cityUnCode);
        this.addressForm.get('pincode').setValue(this.response.address.pincode);

      }

      if(this.response.primaryContact) {
        this.primaryContact.get('designation').setValue(this.response.primaryContact.designation);
        this.primaryContact.get('name').setValue(this.response.primaryContact.name);
        this.primaryContact.get('email').setValue(this.response.primaryContact.email);
        this.primaryContact.get('phoneNumber').setValue(this.response.primaryContact.phoneNumber);
   

      }
      if(this.response.otherContacts && this.response.otherContacts.length>0) {
       
        this.otherContacts.push(...this.response.otherContacts);

      }
      else {
        this.otherContacts.push(this.accountingContact);

      }

    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })

  }

  public uploadFile() {
    let formData = new FormData();
    formData.append("file",this.fileUploadForm.get('files').value[0])
    this.controller.presentLoading("Uploading file...");
    this.resolver.fileUpload(formData).toPromise().then((data)=>{
      this.response = data;
      this.companyDetailsOthers.document = this.response.filename;
    }).catch((err)=>{
      this.controller.presentAlert(err.error.error.message);
    }).finally(()=>{
      this.controller.loadCtrl.dismiss();
    })
  }
  public saveCustomer() {

    let formData = this.companyDetailsForm.value;

    this.companyDetailsOthers.contactSegment = parseInt(this.companyDetailsOthers.contactSegment)
    this.companyDetailsOthers.branchId = this.branchId;
    Object.assign(formData, this.companyDetailsOthers);

    this.controller.presentLoading("Saving data...");
    this.contact.saveCustomer(formData,this.customerId).toPromise().then((data) => {

      this.response = data;
      if(this.customerId == 0)
      {
        this.customerId = this.response.id;
      }
      this.saveContact();
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
     // this.controller.loadCtrl.dismiss();
    })
  }

  public saveContact() {
    let formData = this.primaryContact.value;
    if(this.customerGetDetails.primaryContact) {
      formData.id = this.customerGetDetails.primaryContact.id;
    }
    //this.controller.presentLoading("Saving contact data...");
    this.contact.saveContactListByCustomer(this.customerId, formData).toPromise().then((data) => {
      this.response = data;
      if(this.otherContacts.length) {
        this.otherContacts.forEach(element => {
            this.saveOtherContact(element);
        });
      }
      this.saveAddress()
    //  this.controller.presentAlert("Primay contact details have been successfully saved");
    }).catch((err) => {

    }).finally(() => {
     // this.controller.loadCtrl.dismiss();
    })
  }

  public saveOtherContact(data: any) {

    data.notes = "";

   // this.controller.presentLoading("Saving contact data...");
    this.contact.saveContactListByCustomer(this.customerId, data).toPromise().then((data) => {
      this.response = data;
      //this.controller.presentAlert("Other contact details have been successfully saved");
    }).catch((err) => {

    }).finally(() => {
     // this.controller.loadCtrl.dismiss();
    })
  }
  public saveAddress() {

    let formData = this.addressForm.value;
    formData.pincode = parseInt(formData.pincode);
    if(this.customerGetDetails.address) {
      formData.id = this.customerGetDetails.address.id;
    }
 //   this.controller.presentLoading("Saving address detaills...");
    this.contact.saveAddressByCustomer(this.customerId, formData).toPromise().then((data) => {
      this.response = data;
      this.controller.presentToast("Customer details have been successfully saved");
      this.saveAndReturn();
    }).catch((err) => {

    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public saveAndReturn() {
    this.controller.modalCtrl.dismiss({
        refresh:true
    })
  }
  public addOtherContact() {
    let formData = Object.assign({}, this.accountingContact);
    this.otherContacts.push(formData);
  }

  public isFormValid():boolean {
    return this.companyDetailsForm.valid && this.primaryContact.valid && this.addressForm.valid
  }


  public startMapSuggestions(event) {
    let place = event;
    if(place.length>=3) {
      this.getMapSuggestions(place);
    }
  }
    public getMapSuggestions(place:string) {
      this.resolver.getMapSuggestions(place).toPromise().then((data:any)=>{
        this.suggestions = data.features;
      //  console.log(this.suggestions)
      })
    }
    public getRolePermissions(feature: string, perm: number) {
      //  Read, Add, Edit , Delete
      return this.auth.getRolePermissions(feature,perm);
    }
  ngOnInit() {
  }

}



