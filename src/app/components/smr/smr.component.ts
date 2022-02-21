import { Component, Input, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-smr',
  templateUrl: './smr.component.html',
  styleUrls: ['./smr.component.scss'],
})
export class SmrComponent implements OnInit {

  @Input() customers:Array<any>=[];
  selectedCustomers:Set<any> = new Set();
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {}
  addCustomer(event) {
    let customer = this.customers.filter(item=>item.id==event)[0];
    this.selectedCustomers.add(customer);
  }
  removeCustomer(customer) {
    this.selectedCustomers.delete(customer);
  }

  public sendSMR() {
    let customers = [];
    this.selectedCustomers.forEach((data)=>{
      customers.push(data.id);
    })
    this.controller.presentLoading("Sending SMR...");
    this.resolver.sendSMR(customers).toPromise().then((data)=>{
      this.controller.modalCtrl.dismiss();

    }).catch((err)=>{
      this.controller.presentAlert(err.error.error.message);
    }).finally(()=>{
      this.controller.loadCtrl.dismiss();
    })
  }
}
