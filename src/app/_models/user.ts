import {BaseModel} from './base.model';
import {BaseObject} from './base.object';
import {URIS} from '@app/_services';
import {RoleAssignmentModel} from '@app/_models/role_assignment';

// import { Timestamp } from 'rxjs/internal/operators/timestamp';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose User model
 */
export class UserModel extends BaseModel {
  username: string;
  password:string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  address: string;
  phone: string;
  birthday: Date;
  business_field: string;
  prepaid: number;
  balance: number;
  lock_time: Date;
  created: Date;
  status: number;
  validated: number;
  default_lang: number;
  login_failed_count: number;
  login_failed_time: Date;
  login_verify_code: string

  static EMAIL_VALIDATION_STATE = {
    UN_VALIDATED: 0,
    VALIDATED: 1
  }
}



export class User extends BaseObject {
  static uri_update = URIS.auth.update_user_info;

  public data: UserModel;
  public model_type = UserModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.username) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_TENTRUYCAP", 'toast-warning');
      return;
    }
    if (!this.data.business_field) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_INDUSTRY", 'toast-warning');
      return;
    }
    if (!this.data.first_name) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_HO", 'toast-warning');
      return;
    }
    if (!this.data.last_name) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_TEN", 'toast-warning');
      return;
    }
    if (!this.data.name) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_NAME", 'toast-warning');
      return;
    }
    if (!this.data.email) {
      this.app_service.showMessageById("PROFILE_PAGE.AL_EMAIL", 'toast-warning');
      return;
    }

    return true;
  };

  /**
   * @return URL for updating object
   */
  public getUpdatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_update;
  }

}
