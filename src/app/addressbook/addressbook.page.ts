import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContactService } from '../services/contact.service';
import { ControllersService } from '../services/controllers.service';
import { ResolverService } from '../services/resolver.service';

@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.page.html',
  styleUrls: ['./addressbook.page.scss'],
})
export class AddressbookPage implements OnInit {

  response: any = {};
  customerList: Array<any> = [];
  showLoader: boolean = false;
  originalList: Array<any> = [];
  data: any = {
    search:"",
    branchId:0,
    contactSegment:0
  }
  constructor(public resolver:ResolverService,public auth:AuthService,private router: Router, public contact: ContactService, public controller: ControllersService) {
    this.data.branchId = this.auth.selectedBranch.id;
  }

  ngOnInit() {
    if (window.localStorage.getItem('auth') == undefined) {
      window.open("/login", "_self");
    }
    this.getCustomers();
  }
  public openNewContact() {
    this.router.navigate(['/new-contact/add']);
  }

  public setSearchQuery(event) {
    this.data.search = event.target.value;
    this.searchAddressBook()
  }
  public searchAddressBook() {
    if (this.data.search.length >= 3) {
      // this.showLoader = true;
      if (this.data.contactSegment != 0)
        this.customerList = this.originalList.filter(item => item.companyName.toLowerCase().includes(this.data.search.toLowerCase()) && item.contactSegment == this.data.contactSegment)
      else {
        this.customerList = this.originalList.filter(item => item.companyName.toLowerCase().includes(this.data.search.toLowerCase()))
      }
      //  this.getCustomers(event.target.value)
    } else {
      this.customerList = this.originalList;
      this.onContactSegmentSelection()
    }
 
  }
  public getCustomers(searchStr: string = "") {
    this.contact.getCustomerList(this.data).toPromise().then((data) => {
      this.showLoader = false;
      this.response = data;
      this.customerList = this.response;
      if (!searchStr) {
        this.originalList = this.customerList;
      }
      //  console.log(this.customerList);
    }).catch((err) => {
      this.controller.presentAlert(err.error.error.message)
    }).finally(() => {
      this.controller.loadCtrl.dismiss();
    })
  }
  async confirmDeletion(id: number) {
    const alert = await this.controller.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
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
            this.deleteCustomer(id);
          }
        }
      ]
    });

    await alert.present();
  }

  public deleteCustomer(id: number) {
    this.controller.presentLoading("Deleting customer...");
    this.contact.deleteCustomerById(id).subscribe((data) => this.response = data,
      (err) => console.warn(err),
      () => {
        this.controller.loadCtrl.dismiss();
        this.getCustomers();
        this.controller.presentAlert("The customer has been successfuly deleted");
      });
  }

  public onContactSegmentSelection() {
    let segment = this.data.contactSegment

     if(segment!=0){
       this.customerList = this.customerList.filter(item=>item.contactSegment==segment);
       }
     }
     public getRolePermissions(feature: string, perm: number) {
      //  Read, Add, Edit , Delete
      return this.auth.getRolePermissions(feature,perm);
    }

    public exportAddressBook() {
      let search:string = this.data.search??""
      if(this.data.contactSegment==0) {
        delete this.data.contactSegment;
      }
      this.resolver.exportAddressbook(search,this.data).toPromise().then((response:any)=>{
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      
        downloadLink.setAttribute('download', `addressbook`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      })
    }
}
