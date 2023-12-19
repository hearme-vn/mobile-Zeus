import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
 
import { APPCONSTS, URIS } from '@app/_services';
import { BaseLogin } from '@app/_bases/baselogin.component';
import {HttpHeaders} from '@angular/common/http';

@Component({
  templateUrl: 'passwordReset.component.html'
})
export class PasswordResetComponent extends BaseLogin {
  URL = URIS.auth.resetPass;
  token = '';

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  loadMainData() {
    this.route.params.subscribe(params => {
      this.token = params['token'] ? params['token'] : '';
    });
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      repassword: ['', Validators.required]
    });
  }

  payload() {
    return {
      password: this.f.password.value,
      repassword: this.f.repassword.value
    };
  }

  validateData() {
    if (!this.f.password.value) {
      this.app_service.showMessageById('RESET_PASS.AL_PASS_REQUIRED', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (this.f.password.value.length < 5) {
      this.app_service.showMessageById('RESET_PASS.AL_PASS_LENGTH', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (this.f.password.value != this.f.repassword.value) {
      this.app_service.showMessageById('RESET_PASS.AL_NHAPLAIMATKHAU', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    return true;
  }

  /**
   * Submit email for reseting password
  */
  onSubmit() {
    if (!this.validateData()) return;

    this.loading = true;
    let _url = this.app_service.Based_URLs.auth + this.URL;
    let param = this.payload();
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token });
    let options = { headers: headers };
    this.app_service.postAPI(_url, param, function(res) {
      // Make message for sending email
      this.app_service.showMessageById('RESET_PASS.RESET_PASSWORD_SUCCESS', APPCONSTS.TOAST_TYPE_INFO);

      // Waiting to goto login page after 5 second
      let LOGIN_TIME_OUT = 2000;
      setTimeout(function() {
        this.goto_login();
      }.bind(this), LOGIN_TIME_OUT);
      
    }.bind(this), null, options).finally(() => {
      this.loading = false;
    });
  }


  goto_login() {
    this.router.navigate([APPCONSTS.LOGIN_PAGE]);
  }
}
