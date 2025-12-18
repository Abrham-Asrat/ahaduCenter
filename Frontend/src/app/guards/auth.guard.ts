import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      return true;
    } else {
      // Redirect to login page
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}
