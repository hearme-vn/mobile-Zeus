import { BaseObject } from './base.object';
import { URIS } from '@app/_services';

import { BaseModel } from './base.model';
/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Group model represent Group in DB
 */
export class GroupModel extends BaseModel {

  name: string;
  sur_id: string;
  description: string;

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Sep 11, 2022
 * @purpose Group Object for working with Group
 */
export class Group extends BaseObject {

  static uri_create = URIS.main.group_create;
  static uri_info = URIS.main.group_info;
  static uri_update = URIS.main.group_update;
  static uri_delete = URIS.main.group_delete;
  static uri_list = URIS.main.group_list;

  public data: GroupModel;
  public model_type = GroupModel;

  // Update survey to group
  private updateSurvey2Group(group, sur_id) {
    if (!sur_id || !group.id)   return;

    group.sur_id = sur_id;
    const update_group_survey = this.app_service.Based_URLs.main + URIS.main.group_survey + group.id + '/' + sur_id;
    return this.app_service.getAPIPromise(update_group_survey);
  }

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
   */
  validatedata() {
    if (!this.data.name) {
      this.app_service.showMessageById("GROUP_PAGE.AL_TENNHOMTHIETBI", 'toast-warning');
      return false;
    }
    return true;
  };

  /**
   * Update survey to group
  */
  postCreate(res) {
    if (this.data.sur_id) {
      return this.updateSurvey2Group(res, this.data.sur_id);
    }
  }

  /**
   * Update survey to group
  */
  postUpdate(res) {
    if (this.data.sur_id && (this.data_old.sur_id != this.data.sur_id)) {
      return this.updateSurvey2Group(res, this.data.sur_id);
    }
  }
}
