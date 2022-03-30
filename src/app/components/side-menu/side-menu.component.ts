import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  currentPath: string;
  currentPathIndex: number;
  paths: Array<string> = [
    "/dashboard",
    "/categories",
    "/products",
    "/orders",
    "/sellers",
    "/users",
    "/sizes",
    "/brands",
    "/payment",
    "/posts",
    "/users/admin"
  ]
  userData: any = {}
  role: any = {};
  selectedBranch: any;
  @ViewChild('branch', { static: false }) branch: IonSelect
  constructor(public auth: AuthService) {
    this.currentPath = window.location.pathname;
    this.userData = this.auth.fetchUserProfile()
    this.selectedBranch = this.auth.selectedBranch;
    this.role = this.auth.getUserRole();
  }
  ngOnInit(): void {
    if (this.paths.includes(this.currentPath)) {
      this.currentPathIndex = this.paths.findIndex(item => item == this.currentPath);
      console.log(this.currentPathIndex.toString())
      if (this.currentPathIndex != -1) {
        let elem = document.getElementById("m" + this.currentPathIndex);
        if (elem) {
          elem.className = "nav-item active";
        }

      }

    }
    if (this.branch) {
      this.branch.interface = "popover";
    }
  }

  public getRolePermissions(feature: string, perm: number) {
    //  Read, Add, Edit , Delete
    return this.auth.getRolePermissions(feature,perm);
  }
}
