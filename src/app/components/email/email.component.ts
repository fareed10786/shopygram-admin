import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BcryptService } from 'src/app/services/bcrypt.service';
import { ControllersService } from 'src/app/services/controllers.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})

export class EmailComponent implements OnInit {
  

  public errorMessages = {
    'pattern': 'Email must be in format abc@abc.com',
  };
  public validators = [this.checkPattern];


@ViewChild('form', { static: false }) form: NgForm;
	public dataModel: any;
	public editorTextCount = 0;
	public isSubmitted: boolean = false;
	public isFieldEmpty: boolean = false;
	public isMaxLengthLimitReached: boolean = false;
  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    width: 'auto',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter your email',
   
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['customClasses', 'fontName','insertImage', 'insertVideo', 'toggleEditorMode'],
    ],
  };
  public formDetails = {
    subject: '',
    body: '',
  };
  emailRecipients:string;
  emailBody:string;
  public  items = [];
  toEmails:any = [];
  subject:string
  body:string = ""
  updateDate:any;
  updateTime:any;

  @Input() customerEmail:string
  @Input() bookingId:string
  @Input() showDateTime:boolean;
  @Input() status:string;
  details:any={}
  constructor(public controller: ControllersService,public bcrypt:BcryptService) {
    let today = new Date();

    
    this.updateDate =  today.toISOString().substring(0,today.toISOString().indexOf('T'));
    this.updateTime = today.toTimeString().substring(0,today.toTimeString().lastIndexOf(":"));
   }

  ngOnInit() {
    if(this.customerEmail) {
     this.details = this.bcrypt.fetchAccessToken();
     this.toEmails.push({label:this.customerEmail})
     this.subject = `${this.bookingId}`
     this.body = `Hello,
     <br/>
     <br/>
     Attached is the booking confirmation for ${this.bookingId}
     <br/>
     <br/>

     Regards, <br/>
     ${this.details.firstName}
     `
    }
    if(this.showDateTime) {
      this.subject +=` | Current Status: ${this.status}`;

     this.setSubAndBody();
     }
    
  }

  public setSubAndBody(event?,type:string='') {
    if(event) {
      if(type=="date") {
        this.updateDate = event.target.value;
      }
      else {
        this.updateTime = event.target.value;
      }
    }
    this.body = `Hello,
    <br/>
    <br/>
    The booking status has been updated to <strong>${this.status}</strong> at <strong>${this.updateDate??''}, ${this.updateTime??''}</strong>. <br/>
    Attached is the booking confirmation for ${this.bookingId}
    <br/>
    <br/>

    Regards, <br/>
    ${this.details.firstName}
    `
  }
  public sendEmail():void{
   
    let form = this.form.value
    let emailList = [];
    form.toEmails.forEach(element => {
        emailList.push(element.label);      
    });    
    this.emailRecipients = emailList.toString();
    this.emailBody = form.body;
    this.controller.modalCtrl.dismiss({
      emailRecipients:this.emailRecipients,
      emailBody:this.emailBody,
      emailSubject:form.subject??""
    })
  }

  private checkPattern(control: FormControl) {
    const patternRegex = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    if (patternRegex.test(control.value)) {
      console.log("Match exists.");
    }
    else {
      return { 'pattern': true }
    }
  }

}


