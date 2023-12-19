/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose Interceptor for all http call. This module takes care about Web Token and org_id in POST request
 */

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService, APPService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Checking if there is already authorization jwt token available in local storage
    let token = AuthenticationService.getToken();
    if (token) {
      // Checking if there is authorization token in this request
      let current_header = request.headers;
      if (!current_header.get('Authorization')) {
        // add authorization header with jwt token if available
        request = request.clone({
          setHeaders: { 
            Authorization: `Bearer ${token}`
          }
        });        
      }
    }

    // Should check and add org_id for all POST requests
    let org_id = APPService.getWorkingOrg_Id();
    if (org_id && request.method=='POST' && !(request.body instanceof FormData))   { 
      let body = request.body;
      if (!body.hasOwnProperty("org_id") || body.org_id === undefined ) {
        request = request.clone({ 
          body: {...request.body, ...{'org_id': org_id} }
        });
      }
    }

    return next.handle(request);
  }
}
