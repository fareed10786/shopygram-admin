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


  user:any = {};
  constructor(private activatedRoute:ActivatedRoute,public auth:AuthService,public resolver:ResolverService,public controller:ControllersService) { 

  }

  ngOnInit() {
  }

  public addUser() {
    this.controller.presentLoading("Inviting user..");
      this.resolver.addSubAdmin(this.user).toPromise().then((data:any)=>{
        this.controller.loadCtrl.dismiss();
        this.controller.modalCtrl.dismiss();
        this.controller.presentToast("The sub admin has been successfully added");

    }).catch((err)=>{
      this.controller.presentAlert(err.error.error.message);
    })
  }

}
