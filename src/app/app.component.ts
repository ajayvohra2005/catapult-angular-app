import { Component, OnInit } from '@angular/core';
import { OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet],
  providers: [OidcSecurityService]
})
export class AppComponent implements OnInit {
  configuration$:Observable<OpenIdConfiguration | null>;
  userData$:Observable<UserDataResult>;
  isAuthenticated: boolean = false;
  title: string = "Catapult";

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.configuration$ = this.oidcSecurityService.getConfiguration();
    this.userData$ = this.oidcSecurityService.userData$;
  }

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(
      ({ isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        console.warn('authenticated: ', isAuthenticated);
      }
    );
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }
  
  logout() {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  
    this.isAuthenticated = false;
    window.location.href = "https://auth.your-domain/logout?client_id=your-cognito-client-id&logout_uri=https%3A%2F%2Fyour-app-logout-uri";
  }
  
}
