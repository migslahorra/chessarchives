import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { email, password, confirmPassword } = form.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.authService.CreateUser(email, password);
    this.router.navigate(['signin']);
  }
}
