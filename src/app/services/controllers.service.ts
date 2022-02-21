import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  constructor(public modalCtrl:ModalController,public loadCtrl:LoadingController,public alertCtrl:AlertController,public toastCtrl:ToastController) { }

  async presentLoading(msg="Please wait ...",duration:number=2000) {
    const loading = await this.loadCtrl.create({
      message: msg,
      mode:'ios',
      duration: duration
    });
    await loading.present();

  }
  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      message: msg,
      mode:'ios',
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration:1000
    });

    await toast.present();
  }
}
