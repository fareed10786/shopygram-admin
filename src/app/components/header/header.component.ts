import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  currentPath: string;
  currentPathIndex: number;
  paths: Array<string> = [
    "/dashboard",
    "/bookings",
    "/addressbook",
    "/users/all",
    "/track"
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

  ngOnInit() {
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

  public openBranchSelection(event: UIEvent) {
    this.branch.open(event)
  }
  public selectBranch(event) {
    let branch = this.userData.branches.filter(item => item.id == parseInt(event.target.value))[0];
    this.auth.selectBranch(branch);
    
  }
  public toggleMenu() {
    let elem = document.getElementById('sidebar');
    let classList = elem.classList;
    if(classList.contains('active')) {
      classList.remove('active')
      return;
    } 
    classList.add('active')

  }

  public getRolePermissions(feature: string, perm: number) {
    //  Read, Add, Edit , Delete
    return this.auth.getRolePermissions(feature,perm);
  }

  public goToForms() {
    window.open(`https://ubf-forms.netlify.app/admin/bookings?token=${this.auth.fetchCredentials().token}`,"_blank");
  }
}
