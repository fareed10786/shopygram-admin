import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Booking } from '../interfaces/booking';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverService {
  inviteUser(user: any) {
    return this.http.post(`${this.baseURL}/invitation`,user);
  }



  baseURL: string = environment.apiURL
  constructor(private http: HttpClient,public auth:AuthService) { }

  /**
   * 
   * @param data 
   * @returns 
   */
  public fileUpload(data,purpose:number = 2) {
    return this.http.post(`${this.baseURL}/files/${purpose}`,data);
  }

  /**
   * 
   * @returns 
   */
  public getShipmentModes() {
    return this.http.get(`${this.baseURL}/shipmentmodes`)
  }

  /**
   * 
   * @returns 
   */
  public getSeaports() {
    return this.http.get(`${this.baseURL}/seaports`)
  }

  /**
   * 
   * @returns 
   */
  public getPackageTypes() {
    return this.http.get(`${this.baseURL}/packagetypes`)
  }

  /**
   * 
   * @returns 
   */
  public getLocationTypes() {
    return this.http.get(`${this.baseURL}/locationtypes`)
  }

  /**
   * 
   * @returns 
   */
  public getIncoterms() {
    return this.http.get(`${this.baseURL}/incoterms`)
  }

  /**
   * 
   * @param role 
   */
  public getUsersByRole(role:number) {
    return this.http.get(`${this.baseURL}/users/roles/${role}`);

  }

  /**
   * @description generate booking id 
   * @returns 
   */
  public generateBookingId() {
    return this.http.get(`${this.baseURL}/bookings/generate-id`,{responseType: 'text'});
  }

  /**
   * @description get container types
   * @returns 
   */
  public getContainerTypes() {
    return this.http.get(`${this.baseURL}/containertypes`)
  }

  /**
   * @description get available airport list
   * @returns 
   */
  public getAirports() {
    return this.http.get(`${this.baseURL}/airports`)
  }

  /**
   * @description get available airline list
   * @returns 
   */
  public getAirlines() {
    return this.http.get(`${this.baseURL}/airlines`)
  }

  /**
   * @description get available shippping lines list
   * @returns 
   */
  public getShippingLines() {
    return this.http.get(`${this.baseURL}/shippinglines`)
  }
  /**
   * 
   * @param finalBookingForm 
   * @returns 
   */
  saveBooking(finalBookingForm: any) {
    return this.http.post(`${this.baseURL}/bookings`,finalBookingForm);
  }

  /**
   * 
   * @returns 
   */
  public getBooking() {
    return this.http.get(`${this.baseURL}/bookings`);
  }


  /**
   * 
   * @param id 
   * @returns 
   */
  public getBookingById(id:number) {
    return this.http.get(`${this.baseURL}/bookings/${id}`);
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public updateBookingById(id:number,data:Booking) {
    return this.http.patch(`${this.baseURL}/bookings/${id}`,data);
  }

  /**
   * @description export booking
   * @returns 
   */
  public exportBookingExcel(filter) {
    return this.http.get(`${this.baseURL}/bookings/export?filter=${filter}`,{responseType:'blob' as 'json'});
  }

  /**
   * @description export booking pdf by booking id
   * @param id 
   * @returns 
   */
  public exportBookingPDF(id:number) {
    return this.http.get(`${this.baseURL}/bookings/${id}/export/pdf`,{responseType:'arraybuffer'})
  }

  /**
   * 
   * @param filter 
   * @returns 
   */
  public applyFilter(filter: string,type:string = "") {
    return type=="active"? this.http.get(`${this.baseURL}/bookings/active?filter=${filter}`):
    this.http.get(`${this.baseURL}/bookings?filter=${filter}`);

  }

  /**
   * 
   * @returns 
   */
  public getSalesManagerWiseBookings(filter:string = ""){
    return this.http.get(`${this.baseURL}/stats/salesmanager-bookings?filter=${filter}`);
  }

  /**
   * 
   * @returns 
   */
  public getActiveBookings() {
    return this.http.get(`${this.baseURL}/bookings/active`)
  }

  /**
   * 
   * @param bid 
   * @returns 
   */
  deleteJob(bid: number) {
      return this.http.delete(`${this.baseURL}/bookings/${bid}`);
    }
  
  /**
   * 
   * @returns 
   */
  public portPerformance(filter:string = "") {
    return this.http.get(`${this. baseURL}/stats/port-performance?filter=${filter}`);
  }

  /**
   * 
   * @param filter 
   * @returns 
   */
  public saleStats(filter:string = ""){
    return this.http.get(`${this.baseURL}/stats/bookings?filter=${filter}`)
  }

  /**
   * 
   * @returns 
   */
   public getTotalBookingStats(filter:string = "") {
    return this.http.get(`${this.baseURL}/stats/bookings/total?filter=${filter}`)
  }

  /**
   * 
   * @returns 
   */
  public getTopCustomers(filter:string = "") {
    return this.http.get(`${this.baseURL}/customers/top?filter=${filter}`);
  }


  /**
   * 
   * @param customers 
   * @returns shipment management report to customers
   */
  public sendSMR(customers:Array<number>) {
    return this.http.post(`${this.baseURL}/bookings/smr`,{customers:customers});
  }

  /**
   * 
   * @param place 
   * @returns array list of suggested places 
   */
  public getMapSuggestions(place:string) {
    return this.http.post(`${this.baseURL}/geocoding`,{search:place});
  }

  /**
   * 
   * @param filter 
   * @returns 
   */
   public exportAddressbook(searchStr:string = "",filter:any) {
    return this.http.get(`${this.baseURL}/customers/export/excel?searchStr=${searchStr}&filter=${JSON.stringify(filter)}`,{responseType:'blob' as 'json'})
  }

  /**
   * 
   * @param data
   * @description COSCO tracking 
   * @returns 
   */
  public getCOSCOTrackAndTrace(data) {
    return this.http.post(`${this.baseURL}/tracking`,data);
  }

  /**
   * 
   * @param data 
   * @description Maersk Tracking
   * @returns 
   */
  public getMaerskTrackAndTrace(data) {
    data.eventType = "EQUIPMENT";
    return this.http.post(`${this.baseURL}/tracking/track-and-trace`,data);
  }

  /**
   * 
   * @param data
   * @description MSC tracking 
   * @returns 
   */
  public getMSCTrackAndTrace(data) {
    data.mscAccessToken = this.auth.fetchCredentials().mscAccessToken;
    return this.http.post(`${this.baseURL}/tracking/msc/track-and-trace`,data);
  }



  /**
   * @description Category Manager
   * @returns 
   */
  public getAllCategories() {
    return this.http.get(`${this.baseURL}/categories`);
  }
  public getCategoryById(id:string) {
    return this.http.get(`${this.baseURL}/categories/${id}`);

  }
  public addCategory(data:any) {
    return this.http.post(`${this.baseURL}/categories`,data);

  }
  public updateAffiliateCommission(id:string,data:any) {
    return this.http.patch(`${this.baseURL}/categories/${id}/affiliate-commision`,data);

  }
  public updatePlatformCommission(id:string,data:any) {
    return this.http.patch(`${this.baseURL}/categories/${id}/platform-commision`,data);

  }
  public updateCategory(id:string,data:any) {

    return this.http.patch(`${this.baseURL}/categories/${id}`,data);

  }
  public activateCategory(id:string) {
    return this.http.patch(`${this.baseURL}/categories/${id}/activate`,{});

  }
  public deactivateCategory(id:string) {
    return this.http.patch(`${this.baseURL}/categories/${id}/deactivate`,{});

  }


  /**
   * Category Manager Ends
   */

  public getProducts() {
    return this.http.get(`${this.baseURL}/products`)
  }
  public getPosts() {
    return this.http.get(`${this.baseURL}/posts`)

  }
  public getOrders() {
    return this.http.get(`${this.baseURL}/orders/all`)

  }

  public getSellerList() {
    return this.http.get(`${this.baseURL}/sellers`)
  }
  /**
   * 
   * @param id 
   * @returns 
   */
  public approveSeller(id:number) {
    return this.http.patch(`${this.baseURL}/sellers/${id}/approve`,{})
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public rejectSeller(id:number,reason:string) {
    return this.http.patch(`${this.baseURL}/sellers/${id}/reject`,{reason:reason})

  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public getOrderById(id:string) {
    return this.http.get(`${this.baseURL}/orders/${id}`)
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public getProductById(id:string) {
    return this.http.get(`${this.baseURL}/products/${id}`);
  }

  public getReportedPosts() {
    return this.http.get(`${this.baseURL}/postreports`);
  }
  public getReportedPostById(id:number) {
    return this.http.get(`${this.baseURL}/postreports/${id}`);
  }
  public getAllUsers(data:any={}) {
    return this.http.get(`${this.baseURL}/users?filter=${JSON.stringify(data)}`);
  }

  public getUserById(id:number) {
    return this.http.get(`${this.baseURL}/users/${id}/profile`);
  }
  public updateUser(id:number,data:any) {
    return this.http.patch(`${this.baseURL}/users/${id}`,data);
  }

  public activateUser(id:number) {
    return this.http.patch(`${this.baseURL}/users/${id}/activate`,{});
  }

  public deactivateUser(id:number) {
    return this.http.patch(`${this.baseURL}/users/${id}/deactivate`,{});
  }

  public addSubAdmin(data:any){
    return this.http.post(`${this.baseURL}/users/add`,data);
  }

  public getSubCategories(id: string) {
    return this.http.get(`${this.baseURL}/categories/${id}/subcategories`)
  }

  public getAllSizes() {
    return this.http.get(`${this.baseURL}/sizes`);
  }
  public getAllSizeBundles() {
    return this.http.get(`${this.baseURL}/bundles`);
  }

  public addSize(data:any) {
    return this.http.post(`${this.baseURL}/sizes`,data);
  }
  public addBundle(data:any) {
    return this.http.post(`${this.baseURL}/bundles`,data);
  }
  updateBundle(bundle: any) {
    return this.http.patch(`${this.baseURL}/bundles/${bundle.id}`,bundle);

  }

  public activateSize(id:string,size:any = {}) {
    return this.http.patch(`${this.baseURL}/sizes/${id}/activate`,size);
  }
  public deactivateSize(id:string,size:any ={}) {
    return this.http.patch(`${this.baseURL}/sizes/${id}/deactivate`,size);
  }

  public getAllBrands() {
    return this.http.get(`${this.baseURL}/brands`);

  }
  public addBrand(data) {
    return this.http.post(`${this.baseURL}/brands`,data);

  }
  public activateBrand(id: string) {
    return this.http.patch(`${this.baseURL}/brands/${id}/approve`,{});

  }
  public deactivateBrand(id: string) {
    return this.http.patch(`${this.baseURL}/brands/${id}/deactivate`,{});
  }
  
}
