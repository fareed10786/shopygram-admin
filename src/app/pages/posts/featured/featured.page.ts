import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';
import { CrudPage } from './crud/crud.page';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.page.html',
  styleUrls: ['./featured.page.scss'],
})
export class FeaturedPage implements OnInit {


  posts:Array<any>=[];
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
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getposts();
  }
  public getposts() {
    this.controller.presentLoading("Getting posts...");
    this.resolver.getFeaturedPosts().subscribe((data:any)=>{
      this.posts = data;
      this.dtTrigger.next();
    })
  }
  async openCrudModal(data:any={ medias:[]}) {

    const modal = await this.controller.modalCtrl.create({
      component: CrudPage,
      cssClass: 'my-custom-class',
      componentProps:{
        post:data,
      }
    });
    modal.onDidDismiss().then((data)=>{
      this.posts = [];
      this.getposts();
    })
    return await modal.present();
  }

}
