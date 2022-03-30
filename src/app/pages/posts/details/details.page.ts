import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  post:any={};
  postId:number = 0;
  response:any={};
  constructor(private router:Router,private activatedRoute:ActivatedRoute,public controller:ControllersService,public resolver:ResolverService) { 
    this.postId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getPostDetails();
  }
  public getPostDetails() {
    this.resolver.getReportedPostById(this.postId).subscribe((data:any)=>{
      this.response = data;
      this.post = data
      console.log(this.post)
    })
  }
  public removePost() {
    this.controller.presentLoading("Removing post...")  ;
    this.resolver.removePost(this.post.id).subscribe((data:any)=>{
      this.router.navigate(['/posts']);
    })
  }

}
