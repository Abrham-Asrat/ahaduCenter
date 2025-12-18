import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Page components
import { HomeComponent } from './pages/home/home.component';
import { CartsComponent } from './pages/carts/carts.component';
import { ComputersComponent } from './pages/computers/computers.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { BooksComponent } from './pages/books/books.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: '**', redirectTo: '' }, // Wildcard route for 404 pages
  { path: 'about', component: AboutComponent },
  { path: 'books', component: BooksComponent },
  { path: 'computers', component: ComputersComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'carts', component: CartsComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'admin-login', component: AdminLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
