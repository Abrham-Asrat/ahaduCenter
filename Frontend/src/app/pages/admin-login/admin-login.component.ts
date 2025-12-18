import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  standalone: false,
})
export class AdminLoginComponent {
  loginData = {
    username: '',
    password: '',
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.loginData.username && this.loginData.password) {
      // Simple validation - in a real app, this would be more secure
      if (
        this.loginData.username === 'admin' &&
        this.loginData.password === 'password'
      ) {
        // Store login status in localStorage
        localStorage.setItem('isAdminLoggedIn', 'true');
        // Redirect to admin dashboard
        this.router.navigate(['/admin']);
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }

  ngOnInit() {
    // Check if already logged in
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      this.router.navigate(['/admin']);
    }
  }
}
