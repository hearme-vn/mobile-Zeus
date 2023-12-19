import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
import {Label} from '@app/_models/label.model';
/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Collection model represent Collection in DB
 */
export class ImageModel extends BaseModel {

  static STATUS_LIST = {
    ACTIVE: 0,
    INACTIVE: 1
  };
  static create_fields = ['col_id', 'type', 'postFile', 'post_order', 'content'];
  static update_fields = ['id', 'content', 'status'];

  fileName: String;
  content: String;
  date: Date;
  type: Number;
  col_id: String;
  post_order: Number;

  postFile: any; // file to upload

  title_texts = []; // List label language
  title_text_links = {};    // Link language code and text
}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Collection Object for working with Collection
 */
export class Image extends BaseObject {

  static uri_create = URIS.main.image_create;
  static uri_update = URIS.main.image_update;
  static uri_delete = URIS.main.image_delete;
  static uri_list = URIS.main.image_list;

  public data: ImageModel;
  public model_type = ImageModel;

  /** Table and column to update language */
  static tableLang = 'post';
  static columnLang = 'content';

  /** Create payload from object data */
  makePayload(fields) {
    if (!fields || !fields.length || !this.data) {    return this.data; }

    if (fields.includes('postFile')) {
      const payload = new FormData();
      for (const attr of fields) {
        if (attr == 'content') {
          payload.append(attr, this.data.title_text_links[this.app_service.device_default_language.code].value);
        } else {
          payload.append(attr, this.data[attr]);
        }
      }
      return payload;
    } else {
      const payload = {};
      for (const attr of fields) {
        if (attr == 'content') {
          payload[attr] = this.data.title_text_links[this.app_service.device_default_language.code].value;
        } else {
          payload[attr] = this.data[attr];
        }
      }
      return payload;
    }
  }

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.id && !this.data.postFile) {
      this.app_service.showMessageById("IMAGE_PAGE.AL_IMAGE_BLANK", 'toast-warning');
      return false;
    }
    return true;
  };

  /**
   * Interceptor for processing after creating object
   * @data Object data returned by creating api
   */
  postCreate(data) {
    this.data.fileName = data.fileName;
    Label.updateLang(this, Image.tableLang, Image.columnLang, this.data.title_texts);
  }

  /**
   * Prepare data before update object
   * */
  preUpdate() {
    Label.updateLang(this, Image.tableLang, Image.columnLang, this.data.title_texts);
  }

}


