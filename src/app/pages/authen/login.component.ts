import {Component, Injector} from '@angular/core';
import {Validators} from '@angular/forms';
import { BarcodeScanner, CheckPermissionResult } from '@capacitor-community/barcode-scanner';

import {APPCONSTS} from '@app/_services';
import {BaseLogin} from '@app/_bases/baselogin.component';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent extends BaseLogin {
  returnUrl: string;
  need_verification = false;
  start_scan_qr = false;

  constructor(
    public injector: Injector,
  ) {
    super(injector);

  }

  /**
   * Init login form
   * */ 
  loadMainData() {
      this.form = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required],
          code: ''
      });
  }

  /**
   * This method is call after login successfully
  */
  postLogin() {
    // GOTO return URL
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    if (this.returnUrl)
      this.router.navigate([this.returnUrl]);
    else
      this.router.navigate([APPCONSTS.DEFAULT_LOGGED_PAGE]);

    this.need_verification = false;
  }

  /**
   * Login with username/ password
   * */ 
  doLogin() {
    this.loading = true;
    let code = this.need_verification ? this.f.code.value : null;
    this.authenticationService.login( this.f.username.value, this.f.password.value, code,
      this.postLogin.bind(this), 
      function(err) {
        if (err && err.code_send)
          this.need_verification = err.code_send;
      }.bind(this)
    ).finally(() => {
      this.loading = false;
    });
  }

  /**
   * Scan login QR code and do login to app
   * */ 
  async loginByQR() {
    try {
      // console.log("Start login by QR Code");
      await BarcodeScanner.prepare();

      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        this.start_scan_qr = true;

        document.querySelector('body').classList.add('scanner-active'); 
        // make background of WebView transparent
        await BarcodeScanner.hideBackground();

        // start scanning and wait for a result
        const result = await BarcodeScanner.startScan();

        // if the result has content
        if (result.hasContent) {
          let token = result.content;
          this.authenticationService.postAuthentication(token);
          this.postLogin();
        } else {
          this.app_service.showMessageById("LOGIN.SCAN_ERROR", 'toast-error');
        }
        this.cancelCamera();
      }
    } catch (error) {
      console.log("Error in using camera: ", error)
    }
  }

  /**
   * Stop camera of barcode scaner
   * */ 
  async cancelCamera() {
    try {
      // Stop camera
      await BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active'); 

      await BarcodeScanner.stopScan();
    } catch (error) {
      console.log("Error in closing camera: ", error);
    }

    this.start_scan_qr = false;
  }


  forgot_password() {
    this.router.navigate([APPCONSTS.FORGOT_PAGE]);
  }

}
