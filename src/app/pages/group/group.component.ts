import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Group} from '@app/_models/group.model';
import {Collection} from '@app/_models';
import {Device, DeviceModel} from '@app/_models/device.model';
import {URIS} from '@app/_services';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing group device
 */
@Component({
  templateUrl: 'group.component.html'
})
export class GroupComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('deviceDialog') deviceDialog;

  object_type = Group;
  /** Structure of filtering form fields */
  filtering_form = {
    name: null
  };

  deviceList = [];

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Load supportive data */
  loadSupportiveData() {
    this.loadSurveyList();
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (this.filtering_form.name) {
      this.params['name'] = this.filtering_form.name;
    } else {
      delete this.params['name'];
    }
  }

  /** open dialog device list */
  openDialogDeviceList(group_id) {
    this.deviceList = [];
    const col_list_filter = {
      status: '100',
      name: '*',
      grp_id: group_id
    };
    this.loadObjectsbyFilter(Device, col_list_filter).subscribe(
      function(data) {
        this.deviceList = data;
        this.deviceDialog.show();
      }.bind(this)
    );
  }

  /**
   * This method is for sending event to a group device
   * @param id group id
   * @param action send action
   * @param msg_id success message id
   */
  groupSendEvent(id, action, msg_id) {
    const url = this.app_service.Based_URLs.socket.api + URIS.socket.groupAction;
    const params = {id: id, action: action};

    this.app_service.getAPIPromise(url, params, msg_id).then(
      function(data) {
        this.app_service.successCase(data, msg_id);
      }.bind(this),
      function(err) {}
    );
  }

}
