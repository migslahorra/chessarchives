import { Component } from '@angular/core';  
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';  
import { Router } from '@angular/router';
@Component({  
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})  
export class SignInComponent{
  constructor(public authservice: AuthService, private router: Router) {}

  onSignIn(form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    this.authservice.signinUser(form.value.email, form.value.password);  
    this.router.navigate(['chess-feed']);
  }  
}  