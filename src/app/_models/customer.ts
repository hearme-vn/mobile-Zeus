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
export class CustomerModel extends BaseModel {
  
  /** Some specific fields for this object */
  name: String;
  phone: String;
  phone2: String;
  email: String;
  address: String;
  url: String;
  company: String;
  birthday: Date;
  notes: String;
  ext_id: String;


}


/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Customer Object for working with customer
 */
export class Customer extends BaseObject {
  url_creating = this.app_service.Based_URLs.main + URIS.main.customer_create;
  url_updating = this.app_service.Based_URLs.main + URIS.main.customer_update;

  static uri_create = URIS.main.customer_create;
  static uri_update = URIS.main.customer_update;
  static uri_list = URIS.main.customer_list;

  public model_type = CustomerModel;

}


