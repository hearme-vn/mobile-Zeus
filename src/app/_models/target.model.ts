import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Device model represent Device in DB
 */
export class TargetModel extends BaseModel {

  name: String;
  division: String;
  face: String;
  note: String;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Group Object for working with Group
 */
export class Target extends BaseObject {

  static uri_create = URIS.main.target_create;
  static uri_update = URIS.main.target_update;
  static uri_delete = URIS.main.target_delete;
  static uri_list = URIS.main.target_list;

  public data: TargetModel;
  public model_type = TargetModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("TARGET_PAGE.AL_TARGET_NAME_EMPTY", 'toast-warning');
      return false;
    }
    return true;
  };

}


