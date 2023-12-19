import {Component, Injector, ViewChild} from '@angular/core';
import {BaseConfig} from '@app/_bases/baseconfig.component';
import {Configure, ConfigureModel} from '@app/_models/configure.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing pos nhanh page
 */
@Component({
  selector: 'pos-nhanh',
  templateUrl: 'pos-nhanh.component.html'
})
export class PosNhanhComponent extends BaseConfig {

  CFG_KEY = 'INT_POS_DEVICES_MAPPING';
  HOOK_URL = 'https://api.hearme.vn/crmpos/webhook/nhanh.vn';
  form = {
    domain: 'nhanh.vn',
    customerid_keychain: '',
    customername_keychain: '',
    pos_keychain: '',
    mapping: [],
  };
  mappingData = {pos_id: '', device_id: ''};
  _maxlength = 128;

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
    this.loadConfigByKey(this.CFG_KEY, function(data) {
      if (data) {
        let cfgValueJson = JSON.parse(data.value);
        for (var j = 0; j < cfgValueJson.length ; j++) {
          if (cfgValueJson[j].domain == 'nhanh.vn') {
            this.form.domain = cfgValueJson[j].domain;
            this.form.customerid_keychain = cfgValueJson[j].customerid_keychain;
            this.form.customername_keychain = cfgValueJson[j].customername_keychain;
            this.form.pos_keychain = cfgValueJson[j].pos_keychain;
            this.form.mapping = cfgValueJson[j].mapping;
          }
        }

      }
    }.bind(this));
  }

  /** Config mapping data */
  addMapping() {
    if (!this.validateAddMap()) return;

    if (!this.form.mapping) {
      this.form.mapping = [];
    }
    this.form.mapping.push({
      pos_id: this.mappingData.pos_id,
      device_id: this.mappingData.device_id
    });
    this.mappingData = {pos_id: '', device_id: ''};
  }
  delMapping(idx) {
    this.form.mapping.splice(idx, 1);
  }
  validateAddMap() {
    if (!this.mappingData.pos_id) {
      this.app_service.showMessageById("POS_NHANH_VN.AL_POS_ID_NOT_BLANK", 'toast-warning');
      return false;
    }
    if (!this.mappingData.device_id) {
      this.app_service.showMessageById("POS_NHANH_VN.AL_DEVICE_ID_NOT_BLANK", 'toast-warning');
      return false;
    }
    return true;
  }

  /**
   * Convert form to saveConfigs list
   */
  formToConfig() {
    this.saveConfigs = [];
    let value = [];
    value.push(this.form);
    this.setDataToSave(this.CFG_KEY, Configure.jsonToString(value), this.VALUE_TYPE.STRING);
  }

}
