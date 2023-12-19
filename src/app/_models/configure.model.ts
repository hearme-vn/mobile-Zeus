import { BaseObject } from './base.object';
import { APPCONSTS, URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Oct 14, 2022
 * @purpose Configure model represent Configure in DB
 */
export class ConfigureModel extends BaseModel {

  cfg_key: string;
  value: string;
  object_id: string
  cfg_order: string;
  
  /***
   * 0: active, 1: Inactive
   */
  static STATUS_LIST = {
    ACTIVE: 0,
    INACTIVE: 1 
  }

  static create_fields = ['cfg_key', 'value', 'object_id', 'cfg_order', 'org_id', 'status'];
  static update_fields = ['cfg_key', 'value', 'object_id', 'cfg_order', 'status', 'id'];

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Oct 14, 2022
 * @purpose Configure Object for working with Configure
 */
export class Configure extends BaseObject {

  static uri_create = URIS.main.configure_create;
  static uri_update = URIS.main.configure_update;
  // static uri_delete = URIS.main.configure_delete;
  static uri_list = URIS.main.configure_list;

  public data: ConfigureModel;
  public model_type = ConfigureModel;

  public chkRequired: boolean;
  public chkValidate: boolean;
  public chkStatus: boolean;

  public device_languages = {
    langs: [],          // List of languages
    default_id: 0       // Default Language id
  }

  /**
   * From configure value, set check values for contact survey object: Required, Validate, status
   * 
  */
  setContactCheckValues() {
    // Status
    this.chkStatus = false;
    if (this.data.status==ConfigureModel.STATUS_LIST.ACTIVE) {
      this.chkStatus = true
    }

    // checkRequired, check Validate
    const value = Number(this.data.value);
    if (!value)   return;

    if (value == 2) {
      this.chkRequired = true;
      this.chkValidate = false;
    }
    else if (value == 3) {
      this.chkRequired = true;
      this.chkValidate = true;
    }
    else {
      this.chkRequired = false;
      this.chkValidate = false;
    }    
  }

  /**
   * From check values for contact survey object: Required, Validate, set configure value
  */
   setContactConfigureValue() {
    // For status
    if (this.chkStatus) {
      this.data.status = ConfigureModel.STATUS_LIST.ACTIVE
    } else {
      this.data.status = ConfigureModel.STATUS_LIST.INACTIVE
    }

    // For required and validate
    if (this.chkValidate) {
      this.data.value = "3"
    } else if (this.chkRequired) {
      this.data.value = "2"
    } else {
      this.data.value = "1"
    }
  }

  /**
   * Save config
   * @param app
   * @param configCode
   * @param configValue
   * @param configStatus
   */
  static updateConfig(app, configCode, configValue, configStatus) {
    var _config = app.configs[configCode];

    if (_config) {
      _config.value = configValue;
      if (configStatus != null) {
        _config.status = configStatus;
      }
      app.app_service.postAPI(app.getMainURL(Configure.uri_update), _config);
    } else {
      var param = {
        cfg_key: configCode,
        value: configValue,
        status: configStatus != null ? configStatus : 0
      };
      app.app_service.postAPI(app.getMainURL(Configure.uri_create), param);
    }
    app.app_service.showMessageById("MSG.UPDATE_OBJECT", 'toast-success');
  }

  static jsonToString(_json) {
    if (!_json) return '';
    return JSON.stringify(_json, function( key, value ) {
      if( key === "$$hashKey" ) {
        return undefined;
      }
      return value;
    });
  }
}
