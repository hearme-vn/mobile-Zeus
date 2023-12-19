import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
 
import { APPCONSTS, URIS } from '@app/_services';
import { BaseLogin } from '@app/_bases/baselogin.component';

@Component({
  templateUrl: 'forgot.component.html'
})
export class ForgotComponent extends BaseLogin {
  URL = URIS.auth.reset;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  loadMainData() {
      this.form = this.formBuilder.group({
          email: ['', Validators.required],
      });
  }
  payload() {
    return {
      email: this.f.email.value
    };
  }

  validateData() {
    if (!this.f.email.value) {
      this.app_service.showMessageById('FORGOT.AL_EMAIL', APPCONSTS.TOAST_TYPE_WARNING);
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
    this.app_service.postAPI(_url, param, function(res) {
      // Make message for sending email
      this.app_service.showMessageById('RESET_PASS.EMAIL_SENT', APPCONSTS.TOAST_TYPE_INFO);

      // Waiting to goto hearme page after 5 second
      let LOGIN_TIME_OUT = 2000;
      setTimeout(function() {
        this.goto_login();
      }.bind(this), LOGIN_TIME_OUT);

    }.bind(this)).finally(() => {
      this.loading = false;
    });
  }
  
  /**
   * Rounting to login page
  */
  goto_login() {
    this.router.navigate([APPCONSTS.LOGIN_PAGE]);
  }
}
