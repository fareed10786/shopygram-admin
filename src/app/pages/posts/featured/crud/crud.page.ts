import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/interfaces/category';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {


  post:any = {
    medias:[],
  };
  files:Array<any>=[];
  constructor(private activatedRoute:ActivatedRoute,public auth:AuthService,public resolver:ResolverService,public controller:ControllersService) { 

  }

  ngOnInit() {
  }

  public createFeaturedPost() {
    console.log(this.files);
    for(let i = 0; i < this.files.length; i++){
      let item = this.files[i]
      this.uploadFileToServer(item,i);
    
    }
  }
  
  public alterFeaturedPost() {
    this.controller.presentLoading("Adding featured post..");
     let endpoint = this.post.id?this.resolver.updateFeaturedPost(this.post):this.resolver.addFeaturedPost(this.post);
      endpoint.toPromise().then((data:any)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();
        this.controller.presentToast("The featured post has been successfully posted");

    }).catch((err)=>{
      this.controller.presentAlert(err.error.error.message);
    })
  }
  public uploadFile(event) {

    let files = event.target.files;
    this.files = files;
  }

  public uploadFileToServer(img, index: number) {

    let formData = new FormData();
    formData.append('file', img);
    this.resolver.uploadFile(7, formData).toPromise().then((data:any) => {
      this.post.medias.push({mediaType:1,media:data.filename});
      if(index==this.files.length-1) {
        this.alterFeaturedPost();
      }

    }).catch((err) => {
      console.log(err);
    }).finally(() => {

    })
  }

}
