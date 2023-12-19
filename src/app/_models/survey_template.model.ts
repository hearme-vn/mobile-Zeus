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

class SurveyTemplateModel extends BaseModel {
  /**
   * Add fields to based model
  */
  name: string;
  description: string;
  bussiness_field: number;


  static create_fields = [];
  static update_fields = [];

  /**
  * Survey Constructor
  */
  constructor( raw_data ) {
    super(raw_data);
  }
}

class SurveyTemplate extends BaseObject {

  /** URI for manipulating object */
  static uri_list: string =   URIS.main.survey_template_list;

  /**
  * Survey Template Constructor
  */
   constructor( injector: Injector, raw_data=null) {
    super(injector, raw_data);
  }  
}

export { SurveyTemplateModel, SurveyTemplate };