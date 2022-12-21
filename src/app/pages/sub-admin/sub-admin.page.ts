import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.page.html',
  styleUrls: ['./sub-admin.page.scss'],
})
export class SubAdminPage implements OnInit {
  users:Array<any>=[];
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
    this.getUsers();
  }
  public getUsers() {
    this.controller.presentLoading("Getting users...");
    let data = {roleId:4}
    this.resolver.getAllUsers(data).subscribe((data:any)=>{
      this.users = data;
      this.dtTrigger.next();
    })
  }
  public changeStatus(data) {
    this.controller.presentLoading("Updating status...")

    if(data.status) {
      data.status = 0;
      this.resolver.deactivateUser(data.id).subscribe((data)=>{
        this.controller.presentAlert("The user has been successfully deactivated");
        this.controller.loadCtrl.dismiss();
      })
    }else {
      data.status = 1;
      this.resolver.activateUser(data.id).subscribe((data)=>{
        this.controller.presentAlert("The user has been successfully activated");
        this.controller.loadCtrl.dismiss();

      })
    }
  }
  async openCrudModal() {

    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
 
    });

    return await modal.present();
  }
}



