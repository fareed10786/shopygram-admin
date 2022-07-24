import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  sellers:Array<any>=[];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    scrollX: true,
    pageLength: 50,
  dom: 'frtlp',
  responsive:true,
  columnDefs:[
 { orderable: true, targets: 0 }
],
order: [
 [0, 'asc'],

],
    language: {
      search: "Search :",
      searchPlaceholder: "query",
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
  response: any[];
  allowSaleStatuses:Array<any>=[7]
  allowReturnStatuses: any = [];
  sales: any;
  returns: any;
  orders:any=[]
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getOrders();
  }
  public getsellers() {
    this.controller.presentLoading("Getting sellers...");
    this.resolver.getSellerList().subscribe((data:any)=>{
      this.sellers = data;

    
    })
  }
  public getOrders() {
    this.resolver.getOrders().toPromise().then((data:any[])=>{
      this.response = data;
      let sales = this.response.filter((item)=>this.allowSaleStatuses.includes(item.status))
      this.orders = this.response;
      
      this.dtTrigger.next();

    })
  }


}
