import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Theme model represent Theme in DB
 */
export class ThemeModel extends BaseModel {
  static update_fields = ["id", "name", "description", "status", "background", "header", "type_id", "surveys", "css_class"];

  background: String;
  css_class: String;
  description: String;
  header: String;
  name: String;
  surveys: String;
  type_id: Number;
  type_key_name: String;
  type_names: String;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Theme Object for working with Theme
 */
export class Theme extends BaseObject {

  static uri_create = URIS.main.theme_create;
  static uri_update = URIS.main.theme_update;
  static uri_delete = URIS.main.theme_delete;
  static uri_list = URIS.main.theme_list;
  static uri_type_list = URIS.main.themetype_list;
  static LIST_THEME_TYPE_NAME = ['THEME_PUBLIC', 'THEME_ECOMMERCE', 'THEME_PUBLIC'];

  public data: ThemeModel;
  public model_type = ThemeModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("THEME_PAGE.AL_THEME_NAME_EMPTY", 'toast-warning');
      return false;
    }
    return true;
  };

}


