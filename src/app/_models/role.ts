import { BaseModel } from './base.model';
import { BaseObject } from './base.object';
import { PermissionModel } from './permission';
import { URIS } from '@app/_services';
import { Injector } from '@angular/core';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose For working with role model
 */
export class RoleModel extends BaseModel {
  static create_fields = ['name', 'org_id', 'permissions'];
  static update_fields = ['id', 'name', 'org_id', 'user_id', 'status', 'created', 'type', 'permissions'];

  /**
   * Define values for type property
   */ 
  static ROLE_TYPES = {
    PUBLIC: 0,
    PRIVATE: 1
  };   // 0: Public role; 1: private - used for owner role and cannot assign to the others

  name: string;
  type: number;

  /**
   * Store permission array from database
  */
  permissions: [any];

  /**
   * Dictionary of permission_id : permission model
  */
  permission_models: {};

  /**
   * init data for displaying permissions in editing form
  */
  afterInitModel() {
    this.permission_models = {};
    if (this.permissions && this.permissions.length) {
      for (let permission of this.permissions) {
        let permission_model = new PermissionModel(permission);
        permission_model.org_id = this.org_id;
        this.permission_models[permission["permission_id"]] = permission_model;
      }
    }
  }
}

/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Object for working with role
 */
export class Role extends BaseObject {

  static uri_create = URIS.auth.role_create;
  static uri_update = URIS.auth.role_update;
  static uri_delete = URIS.auth.role_delete;
  static uri_list = URIS.auth.role_list;

  public data: RoleModel;
  public model_type = RoleModel;

  constructor( injector: Injector, raw_data, ...args: any[]
    ) {
    super(injector, raw_data, args);
    this.data = this.model_type.newModel(raw_data);
  }
    
  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("MSG.ROLE_NAME_EMPTY", 'toast-warning');
      return false;
    }

    if (!this.data.permission_models || !Object.keys(this.data.permission_models).length) {
      this.app_service.showMessageById("MSG.ROLE_PERMISSION_EMPTY", 'toast-warning');
      return false;
    }

    for (let permission_id of  Object.keys(this.data.permission_models)) {
      let permission = <PermissionModel>(this.data.permission_models[permission_id]);
      if (!permission.validate_data())  {
        this.app_service.showMessageById("MSG.ROLE_PERMISSION_INVALID", 'toast-warning');
        return false;  
      }
    }
    return true;
  };

  /**
   * @return URL for creating object - in IAM module
   */
  public getCreatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_create;
  }

  /**
   * @return URL for updating object - in IAM module
   */
  public getUpdatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_update;
  }

  /**
   *  Create payload for Role: role information and all permissions
   */
  makePayload(fields) {
    let payload = super.makePayload(fields);

    // Make payload for permissions
    let payload_permissions = [];
    for (let permission_id of  Object.keys(this.data.permission_models)) {
      let permission = <PermissionModel>(this.data.permission_models[permission_id]);
      payload_permissions.push(permission.makePayload());
    }
    payload["permissions"] = payload_permissions;
    return payload;
  }

}

