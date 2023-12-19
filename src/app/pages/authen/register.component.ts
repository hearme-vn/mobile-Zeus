import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { APPCONSTS, URIS } from '@app/_services';
import { BaseLogin } from '@app/_bases/baselogin.component';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent extends BaseLogin {
  business_fields: any = [];
  URL = URIS.auth.signup;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  loadMainData() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      business_field: [null, Validators.required],
      email: ['', Validators.required]
    });

    // load business_fields
    this.business_fields = APPCONSTS.INDUSTRIES;
  }
  payload() {
    return {
      username: this.f.username.value,
      password: this.f.password.value,
      first_name: this.f.first_name.value,
      last_name: this.f.last_name.value,
      business_field: this.f.business_field.value,
      email: this.f.email.value,
      name: this.f.first_name.value + ' ' + this.f.last_name.value
    };
  }

  validateData() {
    if (!this.f.username.value) {
      this.app_service.showMessageById('PROFILE_PAGE.AL_TENTRUYCAP', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (!this.f.password.value) {
      this.app_service.showMessageById('REGISTER.AL_PASS', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (!this.f.first_name.value) {
      this.app_service.showMessageById('PROFILE_PAGE.AL_HO', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (!this.f.last_name.value) {
      this.app_service.showMessageById('PROFILE_PAGE.AL_TEN', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (!this.f.business_field.value) {
      this.app_service.showMessageById('PROFILE_PAGE.AL_INDUSTRY', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    if (!this.f.email.value) {
      this.app_service.showMessageById('PROFILE_PAGE.AL_EMAIL', APPCONSTS.TOAST_TYPE_WARNING);
      return;
    }
    return true;
  }
  processSuccess(res) {
    this.authenticationService.login( this.f.username.value, this.f.password.value, null, function(data) {
      this.router.navigate([APPCONSTS.DEFAULT_LOGGED_PAGE]);
    }.bind(this));
  }

}
