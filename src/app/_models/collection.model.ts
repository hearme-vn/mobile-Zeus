import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Collection model represent Collection in DB
 */
export class CollectionModel extends BaseModel {

  name: String;
  date: Date;

  static STATUS_LIST = {
    ACTIVE: 0,
    INACTIVE: 1,
    DELETED: 2
  }

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Collection Object for working with Collection
 */
export class Collection extends BaseObject {

  static uri_create = URIS.main.collection_create;
  static uri_update = URIS.main.collection_update;
  static uri_list = URIS.main.collection_list;
  static uri_info = URIS.main.collection_info;
  static uri_delete = URIS.main.collection_delete;
  static uri_posts = URIS.main.collection_posts;

  public data: CollectionModel;
  public model_type = CollectionModel;

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("COLLECTION.AL_TENBOSUUTAP", 'toast-warning');
      return false;
    }
    return true;
  };

}


