import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders:Array<any>=[];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    scrollX: true,
    pageLength: 50,
  dom: 'frtlp',
    responsive:true,
    ordering:false,

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
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getOrders();
  }
  public getOrders() {
    this.controller.presentLoading("Getting orders...");
    this.resolver.getOrders().subscribe((data:any)=>{
      this.orders = data;
      this.dtTrigger.next()
    })
  }
}
