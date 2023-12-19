import {Component, Injector} from '@angular/core';
import {BasePlugin} from '@app/_bases/baseplugin.component';
import {Plugin, PluginModel} from '@app/_models/plugin.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  selector: 'cfg-hook',
  templateUrl: 'cfg-hook.component.html'
})
export class CfgHookComponent extends BasePlugin {

  plugin_type = PluginModel.TYPE_LIST.HOOK;
  data_old = null;
  data_new = null;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Set init data
   */
  setInitData() {
    this.data_old = {...this.object};
    this.data_new = {...this.object};
    this.data_new.checked = this.data_new.status == PluginModel.STATUS_LIST.ACTIVE;

    // console.log("Data: ", this.data_new);
  }

  /**
   * Save data
   */
  updatePlugin() {
    if (this.data_old && this.data_new) {
      Plugin.updateHookPlugin(this, this.data_old, this.data_new);
    }
  }
}
