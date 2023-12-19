import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
import {Label} from '@app/_models/label.model';
/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Tab model represent Token in DB
 */
export class TokenModel extends BaseModel {
  static create_fields = ['life_time', 'org_id'];

  type: Number;
  destination: string;
  date: Date;

  token: string;
  life_time: Number;
}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Token Object
 */
export class Tokens extends BaseObject {

  static uri_info = URIS.auth.token_info;
  static uri_create = URIS.auth.token_create;
  static uri_delete = URIS.auth.token_delete;

  public model_type = TokenModel;

  /**
   * @return URL for creating object
   */
  public getCreatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_create;
  }

}


