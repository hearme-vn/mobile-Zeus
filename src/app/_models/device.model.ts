import { BaseObject } from './base.object';
// import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Device model represent Device in DB
 */
export class DeviceModel extends BaseModel {

  name: String;
  os: String;
  type: Number;
  secret: String;
  grp_id: String;
  description: String;
  fb_rate: Number;
  fb_method: Number;
  sur_id: String;
  hardware_id: String;
  receivable: Number;
  systemlock: Number;
  socket_status: Number;
  target_id: String;
  socket_action: String;
  link_date: Date;
  login_date: Date;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Group Object for working with Group
 */
export class Device extends BaseObject {

  static uri_create = URIS.oauth.device_create;
  static uri_update = URIS.main.device_update;
  static uri_delete = URIS.main.device_delete;
  static uri_list = URIS.main.device_list;
  static uri_info = URIS.auth.deviceInfo;

  static LIST_DEVICE_TYPE_NAME = ['DEVICE_PAGE.CB_DEVICE_TYPE_KIOSK', 'DEVICE_PAGE.CB_DEVICE_TYPE_WEB', 'DEVICE_PAGE.CB_DEVICE_TYPE_EMAIL'];
  static LIST_DEVICE_TYPE = [
    { key: 0, name: Device.LIST_DEVICE_TYPE_NAME[0] },
    { key: 1, name: Device.LIST_DEVICE_TYPE_NAME[1] },
    { key: 2, name: Device.LIST_DEVICE_TYPE_NAME[2] }
  ];

  public getCreatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.auth + base.uri_create;
  }

  public data: DeviceModel;
  public model_type = DeviceModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("DEVICE_PAGE.AL_TENTHIETBI", 'toast-warning');
      return false;
    }
    return true;
  };

}


