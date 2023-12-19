import {Component, Injector, Input} from '@angular/core';
import {BaseConfig} from '@app/_bases/baseconfig.component';
import {Configure, ConfigureModel} from '@app/_models/configure.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  selector: 'cfg-thank-page',
  templateUrl: 'cfg-thank-page.component.html'
})
export class CfgThankPageComponent extends BaseConfig {
  THANK_STYLE = [{ key: 'popup', name: 'popup'}, { key: 'page', name: 'page'}];

  form = {
    thankpage_style: 'popup',
    thankpage_active: false,
    thankpage_delay: null
  };

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * load config
   */
  loadConfig() {
    this.configs = {};

    // load thank page style config
    this.loadConfigByKey("THANKPAGE_STYLE", function(data) {
      if (data) {
        this.form.thankpage_style = data.value;
        this.form.thankpage_active = (data.status == ConfigureModel.STATUS_LIST.ACTIVE ? true : false);
      }
    }.bind(this));

    // load thank page delay config
    this.loadConfigByKey("THANKPAGE_DELAY", function(data) {
      if (data) {
        this.form.thankpage_delay = Number(data.value);
      }
    }.bind(this));
  }

  /**
   * Convert form to saveConfigs list
   */
  formToConfig() {
    this.saveConfigs = [];
    let status = this.form.thankpage_active ? ConfigureModel.STATUS_LIST.ACTIVE : ConfigureModel.STATUS_LIST.INACTIVE;
    this.setDataToSave('THANKPAGE_STYLE', this.form.thankpage_style, this.VALUE_TYPE.STRING, false, status);
    this.setDataToSave('THANKPAGE_DELAY', this.form.thankpage_delay);
  }

}
