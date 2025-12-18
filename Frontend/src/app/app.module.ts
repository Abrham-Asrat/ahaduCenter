import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Page components
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BooksComponent } from './pages/books/books.component';
import { CartsComponent } from './pages/carts/carts.component';
import { ComputersComponent } from './pages/computers/computers.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

// Shared components
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { FooterComponent } from './components/footer/footer.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    BooksComponent,
    CartsComponent,
    ComputersComponent,
    ContactUsComponent,
    MoviesComponent,
    AdminComponent,
    AdminLoginComponent,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    FeaturedComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule to enable ngModel
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
