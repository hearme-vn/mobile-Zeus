import {BaseObject} from './base.object';
import {URIS} from '@app/_services';

import {BaseModel} from './base.model';

/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Quotation model represent Quotation in DB
 */
export class QuotationModel extends BaseModel {

  type: Number;
  surveys: Number;
  feedbacks: Number;
  users: Number;
  devices: Number;
  start_time: Date;
  end_time: Date;
  price: Number;
  description: string;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Collection Object for working with quotation
 */
export class Quotation extends BaseObject {

  static uri_list = URIS.main.quotation_list;

  public model_type = QuotationModel;

}


