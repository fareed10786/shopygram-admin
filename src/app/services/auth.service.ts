import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BcryptService } from './bcrypt.service';
import { ControllersService } from './controllers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseURL: string = environment.apiURL;
  response: any = {};
  /**
   * Read, Add, Edit , Delete
   * RCED
   */
  permissions:Array<any>=[
    

]
  selectedBranch:any = {};
  constructor(private http: HttpClient, public bcrypt: BcryptService, public controller: ControllersService) { }

  /**
   * @description get current user role
   * @returns id:number, name:string
   */
  public getUserRole() {
   return this.bcrypt.fetchAccessToken().role;
  }
  /**
 * 
 * @param id 
 * @returns 
 */
  public getUserDetails(id: number) {
    return this.http.get(`${this.baseURL}/users/${id}`);

  }

  /**
   * 
   * @param data 
   * @param id 
   * @returns 
   */
  public userUpdate(data: any, id: number) {
    return this.http.patch(`${this.baseURL}/users/${id}`, data);

  }

  /**
   * 
   * @param data 
   * @returns 
   */
  public userReg(data) {
    return this.http.post(`${this.baseURL}/users/registration`, data);
  }

  /**
   * 
   * @param data 
   * @returns 
   */
  public userLogin(data) {
    return this.http.post(`${this.baseURL}/users/login`, data);
  }

  

  public getUserProfile() {
    return this.http.get(`${this.baseURL}/users/me`).subscribe((data) => this.response = data,
      (err) => console.warn(err),
      () => {
        console.log("####USER PROFILE####")
        console.log(this.response);
        this.bcrypt.storeAccessToken(this.response);
        this.controller.presentAlert("The user has been successfully logged in");
        window.open("/dashboard", "_self");
      });
  }
  /**
   * 
   * @returns 
   */
  public fetchCredentials() {
    return JSON.parse(window.localStorage.getItem('auth'));
  }

/**
 * 
 * @returns 
 */
  public fetchUserProfile() {
    return this.bcrypt.fetchAccessToken();
  }
  /**
   * 
   * @returns 
   */
  public userRoles() {
    return this.http.get(`${this.baseURL}/roles`);
  }

  public multiRoles(roles: Array<any>) {
    return this.http.get(`${this.baseURL}/users/roles?roleId=${roles.toString()}`)
  }

  /**
   * 
   * @returns 
   */
  public getUsers() {
    return this.http.get(`${this.baseURL}/users`);

  }

  /**
   * 
   * @param data
   */
  public changeUserStatus(id: number, status: number) {
    return this.http.patch(`${this.baseURL}/users/change-status`, { id: id, status: status });
  }

  /**
   * 
   * @param data 
   * @param id 
   */
  public userUpdatePassword(data: any, id: number) {
    return this.http.patch(`${this.baseURL}/users/${id}/change-password`, data);

  }



  /**
   * 
   * @param code 
   */
  public loginWithMS(code:string) {
    this.controller.presentLoading("Verifying your login...");
    return this.http.post(`${this.baseURL}/users/ms/login`,{code:code})
  }

  public selectBranch(branch) {
    this.selectedBranch = branch;
    window.localStorage.setItem("selectedBranch",JSON.stringify(this.selectedBranch));
    location.reload()
  }

  public getRolePermissions(feature: string, perm: number) {
    //  Read, Add, Edit , Delete
    let features = this.permissions.filter(item => this.getUserRole().id == item.id)[0].features;
    let permissions = features[feature];
    return permissions[perm];
  }


}
