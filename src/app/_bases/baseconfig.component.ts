import {Component, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {APPService, AuthenticationService} from '@app/_services';
import {TranslateService} from '@ngx-translate/core';
import {Configure} from '@app/_models/configure.model';

@Component({
  template: ''
})
export class BaseConfig implements OnInit, OnChanges {
  @Input('configs') configs: any = null;

  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public translate: TranslateService;

  form = {};
  saveConfigs = [];

  MAX_WAIT_TIME = 3600;

  VALUE_TYPE = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean'
  }

  constructor (injector: Injector) {
    this.injector = injector;

    // Store all dependency services
    this.app_service = injector.get(APPService);
    this.authenticationService = injector.get(AuthenticationService);
    this.translate = injector.get(TranslateService);

  }

  public getMainURL(uri) {
    return this.app_service.Based_URLs.main + uri;
  }

  /**
   * Get data for form
   */
  loadFormData() {}

  /**
   * handle changing event from 
  */
  ngOnChanges(changes: SimpleChanges): void {
    this.loadFormData();
  }

  /**
   * load config
   */
  loadConfig() {
    this.configs = {};
    let url = this.app_service.Based_URLs.main + Configure.uri_list;

    this.app_service.postAPI_Observable(url, {}).subscribe(
      function(data) {
        for (var i = 0; i < data.length; i++) {
          this.configs[data[i].cfg_key] = data[i];
        }
        this.loadFormData();
      }.bind(this)
    );
  }

  ngOnInit(): void {
    if (!this.configs) {
      this.loadConfig();
    }
  }

  /**
   * Convert form to saveConfigs list
   */
  formToConfig() {}

  /**
   * Save data
   */
  saveConfig() {
    this.formToConfig();
    for (let data of this.saveConfigs) {
      Configure.updateConfig(this, data.cfg_key, data.value,  data.status);
    }
  }

  /**
   * Load config by key from API
   * @param cfg_key
   * @param callback
   */
  loadConfigByKey(cfg_key, callback) {
    let url = this.app_service.Based_URLs.main + Configure.uri_list;
    this.app_service.postAPI_Observable(url, {cfg_key: cfg_key}).subscribe(
      function(data) {
        if (data && data[0]) {
          this.configs[data[0].cfg_key] = data[0];
          callback(data[0]);
        } else {
          callback(null);
        }
      }.bind(this)
    );
  }

  /**
   * Get value by config key in configs list
   * @param cfg_key
   * @param type
   */
  getConfigValue(cfg_key, type) {
    let data = this.configs[cfg_key];
    if (data && type === this.VALUE_TYPE.NUMBER) {
      return Number(data.value);
    } else if (data && type === this.VALUE_TYPE.STRING) {
      return data.value;
    } else if (data && type === this.VALUE_TYPE.BOOLEAN) {
      return (data.value == "true"? true: false);
    }
  }

  /**
   * Set data to save config
   * @param cfg_key
   * @param value
   * @param type
   * @param isCheckMaxWaitTime
   * @param status
   */
  setDataToSave(cfg_key, value, type=this.VALUE_TYPE.BOOLEAN, isCheckMaxWaitTime=false, status=0) {
    if (value != null && value != undefined && (!isCheckMaxWaitTime || (isCheckMaxWaitTime && value < this.MAX_WAIT_TIME))) {
      this.saveConfigs.push({
        cfg_key: cfg_key,
        value: type != this.VALUE_TYPE.BOOLEAN ? value : value.toString(),
        status: status
      });
    }
  }

  copyToClipboard(str) {
    navigator.clipboard.writeText(str).then(() => {
      this.app_service.showMessageById('MSG.CLIPBOARD_COPIED', 'toast-success');
    });
  }

}
