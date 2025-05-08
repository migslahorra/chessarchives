import { Component } from '@angular/core';  
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';  

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})  
export class SignInComponent{  
  
  constructor(public authservice: AuthService){}  

  onSignIn(form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    this.authservice.SignInUser(form.value.email, form.value.password);  
  }  
}  