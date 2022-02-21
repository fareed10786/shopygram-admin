import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {

  posts:Array<any>=[];
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getposts();
  }
  public getposts() {
    this.controller.presentLoading("Getting posts...");
    this.resolver.getPosts().subscribe((data:any)=>{
      this.posts = data;
    })
  }

}
