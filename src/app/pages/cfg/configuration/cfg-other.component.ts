import {Component, Injector, Input} from '@angular/core';
import {BaseConfig} from '@app/_bases/baseconfig.component';
import {ConfigureModel} from '@app/_models/configure.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  selector: 'cfg-other',
  templateUrl: 'cfg-other.component.html'
})
export class CfgOtherComponent extends BaseConfig {

  form = {
    feedback_timeover: null,
    auto_run_collection: false,
    include_contact_fields: false,
    required_contact_fields: false,
    device_intropage_off: false,
    device_main_color: "#1dce6c"
  };

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Get data for form
   */
  loadFormData() {
    this.form.feedback_timeover = this.getConfigValue('FEEDBACK_TIMEOVER', this.VALUE_TYPE.NUMBER);
    this.form.auto_run_collection = this.getConfigValue('AUTO_RUN_COLLECTION', this.VALUE_TYPE.BOOLEAN);
    this.form.include_contact_fields = this.getConfigValue('INCLUDE_CONTACT_FIELDS', this.VALUE_TYPE.BOOLEAN);
    this.form.required_contact_fields = this.getConfigValue('REQUIRED_CONTACT_FIELDS', this.VALUE_TYPE.BOOLEAN);
    this.form.device_intropage_off = this.getConfigValue('DEVICE_INTROPAGE_OFF', this.VALUE_TYPE.BOOLEAN);
    this.form.device_main_color = this.getConfigValue('DEVICE_MAIN_COLOR', this.VALUE_TYPE.STRING);
  }

  /**
   * Convert form to saveConfigs list
   */
  formToConfig() {
    this.saveConfigs = [];
    this.setDataToSave('FEEDBACK_TIMEOVER', this.form.feedback_timeover, this.VALUE_TYPE.NUMBER, true);
    this.setDataToSave('AUTO_RUN_COLLECTION', this.form.auto_run_collection);
    this.setDataToSave('INCLUDE_CONTACT_FIELDS', this.form.include_contact_fields);
    this.setDataToSave('REQUIRED_CONTACT_FIELDS', this.form.required_contact_fields);
    this.setDataToSave('DEVICE_INTROPAGE_OFF', this.form.device_intropage_off);
    this.setDataToSave('DEVICE_MAIN_COLOR', this.form.device_main_color, this.VALUE_TYPE.STRING);
  }

}
