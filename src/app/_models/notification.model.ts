import { BaseObject } from './base.object';
// import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Customer model represent customer in DB
 */
export class NotificationModel extends BaseModel {

  type: Number;
  title: String;
  content: String;
  serverity: Number;
  creator_id: String;
  feedback_id: String;
  receiver_id: String;
  receiver_org_id: String;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Notification Object for working with Notification
 */
export class Notification extends BaseObject {
  url_counting = this.app_service.Based_URLs.main + URIS.main.notify_count;
  url_detail = this.app_service.Based_URLs.main + URIS.main.notify_detail;
  url_updating = this.app_service.Based_URLs.main + URIS.main.notify_update;
  url_deleting = this.app_service.Based_URLs.main + URIS.main.notify_delete;
  url_deleting_items = this.app_service.Based_URLs.main + URIS.main.notify_delete_items;

  static uri_count = URIS.main.notify_count;
  static uri_detail = URIS.main.notify_detail;
  static uri_update = URIS.main.notify_update;
  static uri_delete = URIS.main.notify_delete;
  static url_delete_items = URIS.main.notify_delete_items;
  static uri_list = URIS.main.notify_list;

  public model_type = NotificationModel;

}


