import {Component, Injector} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {APPCONSTS, URIS} from '@app/_services';

@Component({
  selector: 'loginBarCode',
  templateUrl: 'loginbarcode.component.html'
})
export class LoginBarCodeComponent extends BaseComponent {
  stringQrCode = '';

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  loadMainPageObjects() {
    let url = this.app_service.Based_URLs.auth + URIS.auth.loginBarCode;
    this.app_service.postAPI(url, {life_time: 0}, function(data) {
      this.stringQrCode = data.token;
    }.bind(this));
  }
}
