import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products:Array<any>=[];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    processing: true,
    pageLength: 50,
  dom: 'frtlp',
    responsive:true,
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
    this.getproducts();
  }
  public getproducts() {
    this.controller.presentLoading("Getting products...");
    this.resolver.getProducts().subscribe((data:any)=>{
      this.products = data.reverse();
      this.dtTrigger.next()
    })
  }

}
