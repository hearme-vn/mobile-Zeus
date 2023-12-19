import { Component, Injector, ViewChild } from '@angular/core';
import { TablePageComponent } from '@app/_bases';
import { Plugin, PluginModel } from '@app/_models';

/**
 * @license hearme
 * @copyright 2017-2023 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 25 Jul 2023
 * @purpose for configure feedback plugins - displayed in feedback detail
 */
@Component({
  templateUrl: 'feedback_plugins.component.html'
})
export class FeedbackPluginsComponent extends TablePageComponent {
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
    object_data.type = PluginModel.TYPE_LIST.FEEDBACK;
  }

  /** Set params for search data */
  searchPrams() {
    this.params = {
      type: PluginModel.TYPE_LIST.FEEDBACK
    }
  }

}
