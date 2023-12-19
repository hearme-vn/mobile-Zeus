import { Component, Injector } from '@angular/core';
 
import { URIS } from '@app/_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseLogin } from '@app/_bases/baselogin.component';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 09 Jun 2023
 * @purpose for validating email address
 */
@Component({
  templateUrl: 'emailValidate.component.html'
})
export class EmailValidateComponent extends BaseLogin {
  URL = URIS.auth.email_validate;
  validate_success = false;
  error_message = "";

  constructor(
    public injector: Injector,
    private http: HttpClient
  ) {
    super(injector);
  }
  
  /**
   * Call to validate email api
  */
  ngOnInit(): void {
    this.validateEmailAddress();
  }

  /**
   * Parse token in URL and call API to validate email address
  */
  validateEmailAddress() {
    this.route.params.subscribe(params => {
      let token = params['token'] ? params['token'] : '';
      let headers = new HttpHeaders({'Authorization': 'Bearer ' + token });
      let options = { headers: headers };

      let _url = this.app_service.Based_URLs.auth + this.URL;
      let _component = this;
      return this.http.get(_url, options).toPromise()
        .then((res) => {
          _component.validate_success = true;
        },(err) => {
          _component.error_message = err.error_message;
        })
    });
  }

}
