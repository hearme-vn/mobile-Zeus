import {Component, Injector, ViewChild} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {Configure} from '@app/_models/configure.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.css']
})
export class ConfigurationComponent extends BaseComponent {
  @ViewChild('cfgDeviceBg') cfgDeviceBg;
  @ViewChild('cfgDeviceHeader') cfgDeviceHeader;
  @ViewChild('cfgHook') cfgHook;
  @ViewChild('cfgThankPage') cfgThankPage;
  @ViewChild('cfgOther') cfgOther;

  configs = {};
  isLoadConfig = false;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Insert new object list into current list. Apply when scroll down page
   */
  loadMainPageObjects() {
    // load config list
    this.loadObjectsbyFilter(Configure, {}).subscribe(
      function(data) {
        for (var i = 0; i < data.length; i++) {
          this.configs[data[i].cfg_key] = data[i];
        }
        this.isLoadConfig = true;
      }.bind(this)
    );
  }

  /** Save configs */
  proccess() {
    this.cfgDeviceBg.saveConfig();
    this.cfgDeviceHeader.saveConfig();
    this.cfgHook.updatePlugin();
    this.cfgThankPage.saveConfig();
    this.cfgOther.saveConfig();
  }
}
