import {BaseObject} from './base.object';
import {URIS} from '@app/_services';

import {BaseModel} from './base.model';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Oct 14, 2022
 * @purpose Configure model represent Configure in DB
 */
export class PluginModel extends BaseModel {

  name: string;
  url: string;
  template: string;
  type: Number;
  description: string;
  authorization: string;
  failed_count: Number;
  
  /***
   * 0: active, 1: Inactive
   */
  static STATUS_LIST = {
    ACTIVE: 0,
    INACTIVE: 1 
  }

  /***
   * Plugin type
   */
  static TYPE_LIST = {
    FEEDBACK: 0,
    HOOK: 1,
    REPORT: 3
  }

}


/**
 * @license hearme
 * @copyright 2017-2020 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date Oct 14, 2022
 * @purpose Configure Object for working with Configure
 */
export class Plugin extends BaseObject {

  static uri_create = URIS.main.plugin_create;
  static uri_update = URIS.main.plugin_update;
  static uri_list = URIS.main.plugin_list;
  static uri_delete = URIS.main.plugin_delete;

  public model_type = PluginModel;

  /**
   * Save hook plugin
   * @param app
   * @param dataOld
   * @param dataNew
   */
  static updateHookPlugin(app, dataOld, dataNew) {
    if (dataOld && dataOld.id) {
      if ((dataNew.url != dataOld.url) ||
        dataNew.authorization != dataOld.authorization) {
        dataOld.failed_count = 0;
        dataOld.url = dataNew.url;
        dataOld.authorization = dataNew.authorization;
      }
      dataOld.status = dataNew.checked ? PluginModel.STATUS_LIST.ACTIVE : PluginModel.STATUS_LIST.INACTIVE;
      app.app_service.postAPI(app.getMainURL(Plugin.uri_update), dataOld);
    } else {
      if (dataNew.url && dataNew.authorization) {
        dataNew.status = dataNew.checked ? PluginModel.STATUS_LIST.ACTIVE : PluginModel.STATUS_LIST.INACTIVE;
        dataNew.name = 'Hook URL';
        dataNew.type = PluginModel.TYPE_LIST.HOOK;
        app.app_service.postAPI(app.getMainURL(Plugin.uri_create), dataNew);
      }
    }
    app.app_service.showMessageById("MSG.UPDATE_OBJECT", 'toast-success');
  }
}
