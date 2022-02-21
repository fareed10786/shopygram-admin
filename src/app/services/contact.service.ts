import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  baseURL: string = environment.apiURL
  constructor(private http: HttpClient) { }
  /**
  * 
  * @returns 
  */
  public getCustomerList(filter:any={}) {
    return this.http.get(`${this.baseURL}/customers?filter=${JSON.stringify(filter)}`);

  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public getContactListByCustomer(id: number) {
    return this.http.get(`${this.baseURL}/customers/${id}/contacts`);

  }

  /**
   * 
   * @param data 
   * @returns 
   */
  public saveCustomer(data,id:number) {
    if(id == 0)
    {
      return this.http.post(`${this.baseURL}/customers`, data);
    }
    return this.http.patch(`${this.baseURL}/customers/${id}`,data);
  }
  /**
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  public saveContactListByCustomer(id: number, data: any) {
    if(data.id)
    {
      return this.http.patch(`${this.baseURL}/contacts/${data.id}`, data);
    }
    return this.http.post(`${this.baseURL}/customers/${id}/contacts`, data);

  }
  /**
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  public saveAddressByCustomer(id: number, data: any) {

    if(data.id)
    {
      return this.http.patch(`${this.baseURL}/addresses/${data.id}`, data);
    }
    return this.http.post(`${this.baseURL}/customers/${id}/address`, data);

  }
  /**
   * 
   * @param id 
   * @returns 
   */
  public deleteCustomerById(id: number) {
    return this.http.delete(`${this.baseURL}/customers/${id}`);

  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public getCustomerById(id:number) {
    return this.http.get(`${this.baseURL}/customers/${id}`);

  }
}
