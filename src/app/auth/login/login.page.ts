import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  response: any = {};
  loginForm: FormGroup;
  users: Array<any> = [];
  loginCode: string = "";
  constructor(public authService: AuthService, public controller: ControllersService, public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute

  ) {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.code) {
        this.loginCode = data.code;
        this.authService.loginWithMS(this.loginCode).subscribe((data) => this.response = data,
          (err) => {


            this.controller.loadCtrl.dismiss();
            this.controller.presentAlert(err.error.error.message)
          },
          () => {
            this.controller.loadCtrl.dismiss();
            window.localStorage.setItem("auth", JSON.stringify(this.response))
            this.authService.getUserProfile();
          });;
      }
    })
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {
  }
  public loginUser() {

    let data = this.loginForm.value;
    if (this.loginForm.valid == false) {
      this.controller.presentAlert("One or more fields has invalid or missing data. Please check again and submit");
      return;
    }
    this.controller.presentLoading("Logging in user...")
    this.authService.userLogin(data).subscribe((data) => this.response = data,
      (err) => {
        console.warn(err),
          this.controller.loadCtrl.dismiss();
        this.controller.presentAlert(err.error.error.message)
      },
      () => {
        this.controller.loadCtrl.dismiss();
        window.localStorage.setItem("auth", JSON.stringify(this.response))
        this.authService.getUserProfile();
      });
  }

}
