import {Component, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {APPService, AuthenticationService} from '@app/_services';
import {TranslateService} from '@ngx-translate/core';
import {Plugin, PluginModel} from '@app/_models';

@Component({
  template: ''
})
export class BasePlugin implements OnInit, OnChanges {

  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public translate: TranslateService;

  plugin_type = PluginModel.TYPE_LIST.HOOK;
  object = null;

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
   * Set init data
   */
  setInitData() {}

  /**
   * Load main data
   */
  loadData() {
    let url = this.app_service.Based_URLs.main + Plugin.uri_list;
    this.app_service.postAPI_Observable(url, {type: this.plugin_type}).subscribe(
      function(data) {
        if (data && data[0]) {
          this.object = data[0];
        } else {
          this.object = {};
        }
        this.setInitData();
      }.bind(this)
    );
  }

  /**
   * handle changing event from 
  */
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Save data
   */
  updatePlugin() {}
}
