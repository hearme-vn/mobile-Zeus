/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose Interceptor to process all application error
 */
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService, APPService, Utils, APPCONSTS } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor( private injector: Injector,
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      let app_service = this.injector.get(APPService);
      if ([ 401, 403].indexOf(err.status) !== -1) {
        let error = err.error;
        app_service.err_processor(error);

        // auto logout if 401 Unauthorized
        if (err.status==401) {
          let authenticationService = this.injector.get(AuthenticationService);
          authenticationService.logout();
        }

      } else if (err.status==400) {
        // For bad request due to client request
        let error = err.error;    // Error message in response data
        app_service.err_processor(error);

      } else if (err.status==404) {
        // Missing request resource
        app_service.showMessageById('MSG.ERR_MISSINGRESOURCE', 
          APPCONSTS.TOAST_TYPE_ERROR, 'Missing the requested resource');

      } else if (err.status==0) {
        // Error in network disconnected
        app_service.showMessageById('MSG.ERR_LOSTINTERNET', APPCONSTS.TOAST_TYPE_ERROR);

      } else {
        // const error = err.error.message || err.statusText;
        app_service.err_processor(err.error);
      }

      return throwError(err.error);
      // return throwError(err);
    }))
  }
}