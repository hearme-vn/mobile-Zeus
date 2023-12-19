import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
import {Label} from '@app/_models/label.model';
/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Tab model represent Tab in DB
 */
export class TabModel extends BaseModel {

  static create_fields = ['user_id', 'object_id', 'function', 'label', 'params', 'status', 'org_id'];
  static update_fields = ['id', 'user_id', 'object_id', 'function', 'label', 'params', 'status', 'org_id'];

  object_id: string;
  function: Number;
  label: string;
  params: string;

  lang_texts = []; // List label language
  lang_text_links = {};    // Link language code and text
}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Collection Object for working with Collection
 */
export class Tabs extends BaseObject {

  static uri_create = URIS.main.tabs_create;
  static uri_update = URIS.main.tabs_update;
  static uri_list = URIS.main.tabs_list;

  /** Table and column to update language */
  static tableLang = 'tabs';
  static columnLang = 'label';

  public data: TabModel;
  public model_type = TabModel;

  /** Create payload from object data */
  makePayload(fields) {
    if (!fields || !fields.length || !this.data) {    return this.data; }

    const payload = {};
    for (const attr of fields) {
      if (attr == 'label') {
        payload[attr] = this.data.lang_text_links[this.app_service.device_default_language.code].value;
      } else {
        payload[attr] = this.data[attr];
      }
    }
    return payload;
  }

  /**
   * Interceptor for processing after creating object
   * @data Object data returned by creating api
   */
  postCreate(data) {
    Label.updateLang(this, Tabs.tableLang, Tabs.columnLang, this.data.lang_texts);
  }

  /**
   * Prepare data before update object
   * */
  preUpdate() {
    Label.updateLang(this, Tabs.tableLang, Tabs.columnLang, this.data.lang_texts);
  }

}


