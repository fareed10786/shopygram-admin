import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.page.html',
  styleUrls: ['./brand.page.scss'],
})
export class BrandPage implements OnInit {
  brands: Array<any> = [];
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

  segment: number = 2;
  results: Array<any> = [];
  bundles: Array<any> = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  constructor(private router: Router, public auth: AuthService, public resolver: ResolverService, public controller: ControllersService) { }

  ngOnInit() {
    this.getAllBrands();
  }

  public getAllBrands() {
    this.results = [];
    this.controller.presentLoading("Getting brand list...");
    this.resolver.getAllBrands().subscribe((data: any[]) => {
      this.controller.loadCtrl.dismiss();
      this.results = data;

      if(this.brands.length){
        this.rerender();
      }else {
        this.dtTrigger.next()
      }
      this.brands = data;
    })
  }



  goToBrand(data?: any) {
    if (!data)
      this.router.navigate(['/brands/crud']);
    else {
      this.router.navigate(['/brands/crud'], { queryParams: { id: data.id } });

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
        brands:this.brands,
        bundle:data
      }
    });
    modal.onDidDismiss().then((data) => {
      if(type==1){
      this.getAllBrands();
      } 
  
    })
    return await modal.present();
  }

  public onStatusChange(data, event) {

    let status = data.status == 0 ? false : true
    if (status != event.target.checked) {
      if (event.target.checked) {
        this.approveBrand(data.id)
      }
      else {

        this.deactivateBrand(data.id)

      }
    }
  }
  public approveBrand(id: string) {
    this.controller.presentLoading("Activating brand...");
    this.resolver.activateBrand(id).subscribe((data) => {
      this.controller.loadCtrl.dismiss();
      this.getAllBrands();
    })
  }
  public disapproveBrand(id: string) {
    this.controller.presentLoading("Dis-approving brand...");
    this.resolver.disapproveBrand(id).subscribe((data) => {
      this.controller.loadCtrl.dismiss();
      this.getAllBrands();
    })
  }
  public deactivateBrand(id: string) {
    this.controller.presentLoading("De-activating brand...");
    this.resolver.deactivateBrand(id).subscribe((data) => {
      this.controller.loadCtrl.dismiss();
      this.getAllBrands();

    })
  }
  public onSegmentSelection(event?) {
    if (this.segment == 1) {
      this.results = []

      this.results = this.brands.filter((item)=>item.status==2);
    }
    if (this.segment == 2) {
      this.results = []
      this.results = this.brands
    }
  
  }
}
