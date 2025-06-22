// In your Angular service responsible for API calls 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'your-api-url';

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) {
    
  }

  // Function to invoke POST API Gateway endpoint with Cognito authorization
  post(path: string, body: any): Observable<any> {
    return from(this.oidcSecurityService.getAccessToken()).pipe(
        map(accessToken => {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
          });
          return this.http.post(`${this.apiUrl}/${path}`, body, { headers });
        })
      );
  }


}