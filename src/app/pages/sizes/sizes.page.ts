import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.page.html',
  styleUrls: ['./sizes.page.scss'],
})
export class SizesPage implements OnInit {

  sizes: Array<any> = [];
  category: Partial<any> = {};
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
  dtTriggerB: Subject<any> = new Subject<any>();

  segment: number = 2;
  results: Array<any> = [];
  bundles: Array<any> = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  constructor(private router: Router, public auth: AuthService, public resolver: ResolverService, public controller: ControllersService) { }

  ngOnInit() {
    this.getAllSizes();
  }

  public getAllSizes() {
    this.results = [];
    this.controller.presentLoading("Getting size list...");
    this.resolver.getAllSizes().subscribe((data: any[]) => {
      this.controller.loadCtrl.dismiss();
      this.results = data;

      if(this.sizes.length){
        this.rerender();
      }else {
        this.dtTrigger.next()
      }
      this.sizes = data;
    })
  }

  public getAllBundles() {
    this.results = [];
    this.controller.presentLoading("Getting bundle list...");
    this.resolver.getAllSizeBundles().subscribe((data: any[]) => {
      this.controller.loadCtrl.dismiss();
      this.results = data;
      if(!this.bundles.length){
    
        this.dtTriggerB.next()
      }
      this.bundles = data;

    });
  }

  goToSize(data?: any) {
    if (!data)
      this.router.navigate(['/sizes/crud']);
    else {
      this.router.navigate(['/sizes/crud'], { queryParams: { id: data.id } });

    }
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      if (dtInstance)
        dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  async openCrudModal(type:number=1,data?: any) {
    let def: any = {

    }
    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
      componentProps: {
        type:type,
        sizes:this.sizes,
        bundle:data
      }
    });
    modal.onDidDismiss().then((data) => {
      if(type==1){
      this.getAllSizes();
      } 
      if(type==2) {
        this.getAllBundles();
      }
    })
    return await modal.present();
  }

  public onStatusChange(data, event) {

    let status = data.status == 0 ? false : true
    if (status != event.target.checked) {
      if (event.target.checked) {
        this.approveSize(data.id)
      }
      else {
        this.deactivateSize(data.id)

      }
    }
  }
  public approveSize(id: string) {
    this.controller.presentLoading("Activating size...");
    this.resolver.activateSize(id).subscribe((data) => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public deactivateSize(id: string) {
    this.controller.presentLoading("De-activating size...");
    this.resolver.deactivateSize(id).subscribe((data) => {
      this.controller.loadCtrl.dismiss();
    })
  }
  public onSegmentSelection(event?) {
    if (this.segment == 1) {
      this.results = []

      this.results = this.sizes.filter((item)=>item.status==2);
    }
    if (this.segment == 2) {
      this.results = []
      this.results = this.sizes
    }
    if (this.segment == 3) {
      this.getAllBundles();
    }
  }
}
