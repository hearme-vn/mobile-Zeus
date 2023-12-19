import { BaseModel } from './base.model';
import {BaseObject} from '@app/_models/base.object';
import {URIS} from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose For working with User role assignment model
 */
export class RoleAssignmentModel extends BaseModel {
  static create_fields = ['user_id', 'role_id'];

  name: String;
  email: String;
  username: String;
  role_name: String;
  role_id: String;
  role_type: Number;
}

/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Theme Object for working with role assignment to users
 */
export class RoleAssignment extends BaseObject {

  static uri_create = URIS.auth.role_assignment_create;
  static uri_delete = URIS.auth.role_assignment_delete;
  static uri_list = URIS.auth.role_assignment_list;

  public data: RoleAssignmentModel;
  public model_type = RoleAssignmentModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.user_id) {
      this.app_service.showMessageById("ROLE_PAGE.chua_chon_user", 'toast-warning');
      return false;
    }
    if (!this.data.role_id) {
      this.app_service.showMessageById("ROLE_PAGE.chon_nhom_quyen", 'toast-warning');
      return false;
    }
    return true;
  };

  /**
   * @return URL for creating object
   */
  public getCreatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_create;
  }

}

