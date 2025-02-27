import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage implements OnInit {

  sellers:Array<any>=[];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    processing: true,
    pageLength: 50,
  dom: 'frtlp',
    responsive:true,
       columnDefs:[
      { orderable: true, targets: 0 }
    ],
    order: [
      [0, 'desc'],
    
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
  dtLoaded:boolean = false;
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getsellers();
  }
  public getsellers() {
    this.controller.presentLoading("Getting sellers...");
    this.resolver.getSellerList().subscribe((data:any)=>{
      this.sellers = data;
      if(!this.dtLoaded){
        this.dtLoaded = true;
        this.dtTrigger.next();
      }
    })
  }
  async openCrudModal(data:any) {
    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
      componentProps:{
        seller:data
      }
    });
    modal.onDidDismiss().then((data)=>{
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        if(this.dtLoaded){
          this.dtLoaded = false;
         
        }
      });
  
      this.getsellers();
    })
    return await modal.present();
  }
}
