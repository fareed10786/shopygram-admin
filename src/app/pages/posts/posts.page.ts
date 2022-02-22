import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {

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
    this.resolver.getReportedPosts().subscribe((data:any)=>{
      this.posts = data;
      this.dtTrigger.next();
    })
  }

}
