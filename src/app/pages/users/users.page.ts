import { Component, OnInit } from '@angular/core';
import { ControllersService } from 'src/app/services/controllers.service';
import { ResolverService } from 'src/app/services/resolver.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users:Array<any>=[];
  constructor(public resolver:ResolverService,public controller:ControllersService) { }

  ngOnInit() {
    this.getUsers();
  }
  public getUsers() {
    this.controller.presentLoading("Getting users...");
    this.resolver.getAllUsers().subscribe((data:any)=>{
      this.users = data;
    })
  }
}
