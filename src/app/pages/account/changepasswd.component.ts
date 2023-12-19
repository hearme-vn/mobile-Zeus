import {Component, Injector} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {APPCONSTS, URIS} from '@app/_services';

@Component({
  selector: 'changepasswd',
  templateUrl: 'changepasswd.component.html'
})
export class ChangepasswdComponent extends BaseComponent {
  data = { current: '', password: '', repassword: '' };

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /**
   * Update password
   */
  update() {
    if (!this.data.password) {
      this.app_service.showMessageById('CHANGEPASSWD_PAGE.AL_MATKHAUMOI', "toast-warning");
      return;
    }
    if (this.data.password.length < 5) {
      this.app_service.showMessageById('CHANGEPASSWD_PAGE.AL_MATKHAUMOI5', "toast-warning");
      return;
    }
    if (this.data.password != this.data.repassword) {
      this.app_service.showMessageById('CHANGEPASSWD_PAGE.AL_NHAPLAIMATKHAU', "toast-warning");
      return;
    }

    let url = this.app_service.Based_URLs.auth + URIS.auth.changePasswd;
    this.app_service.postAPI(url, this.data, function(data) {
      if (data.status = 1)
        this.app_service.showMessageById('CHANGEPASSWD_PAGE.AL_CHANGE_PASSWORD_SUCCESS');
      else
        this.app_service.showMessage(data.message, APPCONSTS.TOAST_TYPE_ERROR);
    }.bind(this));
  };
}
