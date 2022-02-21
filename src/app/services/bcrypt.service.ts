import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'
import { ControllersService } from './controllers.service';
const key = '92f2ceed4c503896c8a291e560bd4321' // change to your key
const iv = 'freighttghireiubf' // change to your iv
@Injectable({
  providedIn: 'root'
})
export class BcryptService {

  constructor(public controller:ControllersService) { }
  storeAccessToken(data) {
    console.log(data)
    const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC
    })
    window.localStorage.setItem("permission", JSON.stringify(data))


    console.log(data)
  }
  fetchAccessToken() {
    try {
      const cipher = CryptoJS.AES.decrypt(window.localStorage.getItem("permission"), CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
      })

      return JSON.parse(window.localStorage.getItem("permission"))
    } catch (e) {
      console.log(e);
      this.controller.presentAlert("The token seems to have expired. Please login again.")
      return null
    }
  }
  isAuthenticated() {
    return this.fetchAccessToken() !== null
  }
  logout() {
    window.localStorage.removeItem("permission");
  }
}
