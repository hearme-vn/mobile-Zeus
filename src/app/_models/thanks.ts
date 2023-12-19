import {BaseObject} from './base.object';
import {APPCONSTS, URIS} from '@app/_services';

import {BaseModel} from './base.model';
import {Label} from '@app/_models/label.model';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jan 13, 2023
 * @purpose Thanks model in DB
 */
export class ThanksModel extends BaseModel {
  static CATEGORIES = {
    GENERAL: 0,
    BAD_RATING: 1,
    GOOD_RATING: 2,
    WELCOME: 3,
    WELCOME_INVALID_TOKEN: 4
  }

  static create_fields = ["content", "author", "lang_id", "category", "conditions"];
  static update_fields = ["id", "content", "author"];

  /** Some specific fields for this object */
  content: string;
  author: string;
  lang_id: string;
  category: string;
  conditions: string;
}


/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jan 13, 2023
 * @purpose Thanks object for working with thank page
 */
 export class Thanks extends BaseObject {

  static uri_create = URIS.main.thanks_create;
  static uri_update = URIS.main.thanks_update;
  static uri_list = URIS.main.thanks_list;
  static uri_delete = URIS.main.thanks_delete;

  /** Table and column to update language */
  // static tableLang = 'proverb';
  // static columnLang = 'name';

  public model_type = ThanksModel;
  public data: ThanksModel;

//   /** Create payload from object data */
//   makePayload(fields) {
//     if (!fields || !fields.length || !this.data) {    return this.data; }

//     const payload = {};
//     for (const attr of fields) {
//       if (this.data.id && attr == 'name') {
//         payload[attr] = this.data.lang_text_links[this.app_service.device_default_language.code].value;
//       } else {
//         payload[attr] = this.data[attr];
//       }
//     }
//     return payload;
//   }


  /**
   * Prepare data before update object
   * */
  preUpdate() {
    // Label.updateLang(this, Organization.tableLang, Organization.columnLang, this.data.lang_texts);
  }

}

