import { Component, Injector, OnInit } from '@angular/core';
import { APPCONSTS, APPService, AuthenticationService } from '@app/_services';
import {TranslateService} from '@ngx-translate/core';
// import {Configure} from '@app/_models/configure.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: ''
})
export class BaseLogin implements OnInit {
  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public translate: TranslateService;
  public formBuilder: FormBuilder;
  public route: ActivatedRoute;
  public router: Router;

  form: FormGroup;
  loading = false;
  URL = '';

  constructor (injector: Injector) {
    this.injector = injector;
    this.app_service = injector.get(APPService);
    this.authenticationService = injector.get(AuthenticationService);
    this.translate = injector.get(TranslateService);
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.formBuilder = injector.get(FormBuilder);

  }

  loadMainData() {}

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.authenticationService.isAuthenicated()) {
      this.router.navigate([APPCONSTS.DEFAULT_LOGGED_PAGE]);
    }

    // load page data
    this.loadMainData();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validateData() {
    return true;
  }

  /**
   * Set param to submit form
   */
  payload() {
    return {};
  }

  /**
   * Process after submit successful
   * @param res
   */
  processSuccess(res) {}

  /**
   * Submit form
   */
  onSubmit() {
    if (!this.validateData()) return;

    this.loading = true;
    let _url = this.app_service.Based_URLs.auth + this.URL;
    let param = this.payload();
    this.app_service.postAPI(_url, param, function(res) {
      this.processSuccess(res);
    }.bind(this)).finally(() => {
      this.loading = false;
    });
  }

  /**
   * GOTO specific page
  */
  goto_page(url) {
    this.router.navigate([url]);
  }

}
