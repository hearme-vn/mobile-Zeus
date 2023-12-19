import { Component, Injector, ViewChild } from '@angular/core';
import { TablePageComponent } from '@app/_bases';
import { Plugin, PluginModel } from '@app/_models';

// import {Group} from '@app/_models/group.model';
// import {Device, DeviceModel} from '@app/_models/device.model';
// import {URIS} from '@app/_services';

/**
 * @license hearme
 * @copyright 2017-2023 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 31 May 2023
 * @purpose for configure report plugins
 */
@Component({
  templateUrl: 'report_plugins.component.html'
})
export class ReportPluginsComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Plugin;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForCreatingObject(object: Plugin) {
    let object_data = <PluginModel>(object.data);
    object_data.type = PluginModel.TYPE_LIST.REPORT;
  }

  /** Set params for search data */
  searchPrams() {
    this.params = {
      type: PluginModel.TYPE_LIST.REPORT
    }
  }

}
