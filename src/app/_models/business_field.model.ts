/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 28 Nov 2022
 * @purpose For working with survey template model
 */

import { Injector } from '@angular/core';

import { BaseModel } from './base.model';
import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

class BusinessFieldModel extends BaseModel {
  /**
   * Add fields to based model
  */
  vn: String;
  en: String;
  parent: Number;

  static create_fields = [];
  static update_fields = [];

  /**
  * Survey Constructor
  */
  constructor( raw_data ) {
    super(raw_data);
  }
}

class BusinessField extends BaseObject {

  /** URI for manipulating object */
  static uri_list: String =   URIS.main.business_fields_list;

  /**
  * Survey Template Constructor
  */
   constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }  
}

export { BusinessFieldModel, BusinessField };