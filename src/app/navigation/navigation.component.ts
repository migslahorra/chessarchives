import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "backend/authentication/auth.service"; // Fixed path to match your structure

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy { // Fixed interface spelling
  public userIsAuthenticated = false;
  private authListenerSubs!: Subscription;

  constructor(public authService: AuthService) {}

  toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('light-mode');

  // Save preference
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
}

  ngOnInit() { // Fixed method name (lowercase 'n')
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){  
    this.authService.logout();
  }  
}