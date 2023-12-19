import { BaseModel } from './base.model';
import { BaseObject } from '@app/_models/base.object';
import { URIS } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 20 Mar 2023
 * @purpose For working with permission model
 */
export class PermissionModel extends BaseModel {
  static create_fields = ['permission_id', 'resource_id', 'resource_type', 'action'];
  static update_fields = ['role_id', 'permission_id', 'resource_id', 'resource_type', 'action'];

  /**
   * Define values for permission_id property
   */
  static PERMISSION_IDS = {
    OWNER: "owner",
    ADMIN: "admin",
    OPERATOR: "operator",
    MONITOR: "monitor",
    SERVICE: "service",
    CONFIG: "config"
  };

  /**
   * Define values for resource_id property
   */
  static RESOURCE_TYPES = {
    ORGANIZATION: "organization",
    SURVEY: "survey",
    GROUP: "group",
    DEVICE: "device"
  }

  /**
   * Define values for action property
   */
  static ACTION_TYPES = {
    ALL: "all",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete"
  }

  /**
   * Fields in database
  */
  rol_id: string;
  permission_id: string;
  resource_id: string;
  resource_type: string;
  action: string;

  /**
   * Properies for dispaying permission in editing form
  */
  group_id: string;     // Group id - as resource_id for monitor permission - type group
  device_id: string;    // Device id - as resource_id for monitor permission - type device

  /**
   * Prepare for displaying data in form 
  */
  afterInitModel() {
    if (this.resource_type == PermissionModel.RESOURCE_TYPES.GROUP) {
      this.group_id = this.resource_id;
      this.device_id = undefined;
    } else if (this.resource_type == PermissionModel.RESOURCE_TYPES.DEVICE){
      this.device_id = this.resource_id;
    }
  }

  /**
   * ---- Deprecated ----
   * Init new permission with permission_id
   * @input permission_id
  */
  static createNewPermission(permission_id, org_id, default_group_id) {
    let permission_data = {};
    if (permission_id==PermissionModel.PERMISSION_IDS.MONITOR) {
      permission_data = {
        permission_id: permission_id,
        resource_id: default_group_id,
        resource_type: PermissionModel.RESOURCE_TYPES.GROUP,
        action: "all"
      }
    } else {
      permission_data = {
        permission_id: permission_id,
        resource_id: org_id,
        resource_type: PermissionModel.RESOURCE_TYPES.ORGANIZATION,
        action: "all"
      }
    }
  }

  /**
   * validate data for permission.
   * Valid: return true; else return false
  */
  validate_data() {
    if (this.permission_id == PermissionModel.PERMISSION_IDS.MONITOR && !this.group_id)   return false;
    return true;
  }

  /**
   * Make payload for permission to create or update role
   */
  makePayload() {
    if (this.permission_id == PermissionModel.PERMISSION_IDS.MONITOR) {
      if (this.device_id) {
        this.resource_type = PermissionModel.RESOURCE_TYPES.DEVICE;
        this.resource_id = this.device_id;
      } else {
        this.resource_type = PermissionModel.RESOURCE_TYPES.GROUP;
        this.resource_id = this.group_id;
      }
    } else if (this.permission_id == PermissionModel.PERMISSION_IDS.OPERATOR) {
      if (this.resource_id != this.org_id)  
        this.resource_type = PermissionModel.RESOURCE_TYPES.SURVEY
      else 
        this.resource_type = PermissionModel.RESOURCE_TYPES.ORGANIZATION;
    }
    return {
      rol_id: this.rol_id,
      permission_id: this.permission_id,
      resource_id: this.resource_id,
      resource_type: this.resource_type,
      action: this.action
    }
  }
}

/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 20 Mar 2023
 * @purpose For working with permission object
 */
export class Permission extends BaseObject {

  public model_type = PermissionModel;

 
}

