import {Component, Injector} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {Tokens} from '@app/_models/token.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for get token in pos nhanh page
 */
@Component({
  selector: 'get-token',
  templateUrl: 'get-token.component.html'
})
export class GetTokenComponent extends BaseComponent {

  object_type = Tokens;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Load object data into page
   */
  loadMainPageObjects() {
    let url = this.app_service.Based_URLs.auth + Tokens.uri_info;
    this.app_service.postAPI(url, {}, function(data) {
      this.object = this.object_type.newObject(this.injector, data ? data : null);
    }.bind(this));
  }

  /** create new token */
  createObject(method='POST') {
    this.object.data.life_time = 0;

    this.object.create(function(res) {
      this.object.data.id = res.id;
      this.object.data.token = res.token;
    }.bind(this), method);
  }

  /**
   *
   * @returns URL for deleting object
   */
  public get_URL_deleting() {
    return this.app_service.Based_URLs.auth + this.object_type.uri_delete;
  }

  postDelete() {
    this.object = this.object_type.newObject(this.injector);
  }

}
