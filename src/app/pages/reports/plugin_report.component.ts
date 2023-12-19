import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/_bases';
import { PluginModel } from '@app/_models';

@Component({
  templateUrl: 'plugin_report.component.html',
  styleUrls: ['plugin_report.component.css']
})
export class PluginReportComponent extends BaseComponent {
  selected_plugin: PluginModel;
  // full_screen = false;
  @ViewChild('reportDialog') reportDialog;
  
  constructor (public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Open dialog to show report in presentation mode expansion mode
  */
  openReportDialog() {
    if (!this.selected_plugin) {
      this.app_service.showMessageById('APP.SELECT_REPORT_PLUGINS', "toast-warning");
      return
    };

    this.reportDialog.show();
  }
}
