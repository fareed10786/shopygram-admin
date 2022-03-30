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
  allowSaleStatuses:Array<any>=[1,2,3,4,5,7]
  allowReturnStatuses: any = [];
  sales: any;
  returns: any;
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getsellers();
  }
  public getsellers() {
    this.controller.presentLoading("Getting sellers...");
    this.resolver.getSellerList().subscribe((data:any)=>{
      this.sellers = data;
      this.getOrders();
      this.dtTrigger.next();
    })
  }
  public getOrders() {
    this.resolver.getOrders().toPromise().then((data:any[])=>{
      this.response = data;
      let sales = this.response.filter((item)=>this.allowSaleStatuses.includes(item.status))
      let returns = this.response.filter((item)=>this.allowReturnStatuses.includes(item.status))

      this.sales = sales;
      this.sellers.forEach((item)=>{
        let data = this.sales.filter((sale)=>sale.sellerId==item.basicInfo.id );
        let total = 0;
        let earning = 0;
        if(data.length) {
          console.log(item.id)
          data.forEach(element => {
            total+= (element.pricing.quantity??1) * (element.pricing.transferPrice); 
            earning += (element.pricing.quantity??1)*(element.pricing.sellingPrice - (element.pricing.transferPrice));
          });
        }
        item.earning = earning;
        item.earningFromSeller = total.toFixed(2);
      })
      this.returns = returns;

    })
  }


}
