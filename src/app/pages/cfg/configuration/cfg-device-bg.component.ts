import {Component, Injector, Input, ViewChild} from '@angular/core';
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
  selector: 'cfg-device-bg',
  templateUrl: 'cfg-device-bg.component.html'
})
export class CfgDeviceBgComponent extends BaseConfig {
  @ViewChild('dlgSelectBackground') dlgSelectBackground;

  form = {
    device_bgr_img: null,
    device_bgr_img_status: false,
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
    this.loadConfigByKey("DEVICE_BGR_IMG", function(data) {
      if (data) {
        this.form.device_bgr_img = data.value;
        this.form.device_bgr_img_status = (data.status == ConfigureModel.STATUS_LIST.ACTIVE ? true : false);
      }
    }.bind(this));
  }

  /**
   * Convert form to saveConfigs list
   */
  formToConfig() {
    this.saveConfigs = [];
    let status = this.form.device_bgr_img_status ? ConfigureModel.STATUS_LIST.ACTIVE : ConfigureModel.STATUS_LIST.INACTIVE;
    this.setDataToSave('DEVICE_BGR_IMG', this.form.device_bgr_img, this.VALUE_TYPE.STRING, false, status);
  }

  /**
   * Select background
   */
  openDialogSelectBG() {
    this.dlgSelectBackground.show();
  }
  setBackground(fileName) {
    this.form.device_bgr_img = fileName;
  }
}
