import { Component, Injector, ViewChild } from '@angular/core';
import { TablePageComponent } from '@app/_bases';
import { Device } from '@app/_models/device.model';
import { CollectionModel } from '@app/_models';
import { Target } from '@app/_models/target.model';
import { APPCONSTS, URIS } from '@app/_services';
import { environment } from '@env/environment';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing group device
 */
@Component({
  templateUrl: 'device.component.html',
  styleUrls: ['device.component.css']
})
export class DeviceComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('secretDialog') secretDialog;
  @ViewChild('surveyServerDialog') surveyServerDialog;

  object_type = Device;
  /** Structure of filtering form fields */
  filtering_form = {
    name: null,
    status: -1
  };
  /** Device status */
  status_list = [
    { name_key: 'APP.UI_STATUS_CREATED', value: 0 },
    { name_key: 'APP.UI_STATUS_ACTIVE', value: 1 },
    { name_key: 'APP.UI_STATUS_LOCK', value: 2 },
    { name_key: 'APP.UI_STATUS_INACTIVE', value: 3 }
  ];
  target_list = [];
  stringQrCode = '';

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Load target list */
  listTarget() {
    const col_list_filter = {
      status: CollectionModel.STATUS_LIST.ACTIVE
    };
    this.loadObjectsbyFilter(Target, col_list_filter).subscribe(
      function(data) {
        this.target_list = data;
      }.bind(this)
    );
  }
  /** Load supportive data */
  loadSupportiveData() {
    this.getGrouplist();
    this.listTarget();
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (this.filtering_form.name) {
      this.params['name'] = this.filtering_form.name;
    } else {
      delete this.params['name'];
    }
    if (this.filtering_form.status != -1) {
      this.params['status'] = this.filtering_form.status;
    } else {
      delete this.params['status'];
    }
  }

  /** Set data when open create dialog */
  initDataForCreatingObject() {
    if (!this.object.data.id) {
      this.object.data.type = 0;
    }
  }

  /**
   * Open select secret dialog
   */
  openSecret(obj) {
    this.object = this.object_type.newObject(this.injector);
    const url = this.app_service.Based_URLs.auth + URIS.auth.deviceResecret + obj.id;
    this.app_service.getAPIPromise(url).then(
      function(data) {
        if (data.status == 1) {
          this.app_service.showMessageById('MSG.AL_LAYMATHIETBITHANHCONG', APPCONSTS.TOAST_TYPE_INFO);
          this.object.data.id = obj.id;
          this.object.data.secret = data.secret;
          this.stringQrCode = obj.id + '_' + data.secret;
          if (environment.root && (environment.root != 'https://hearme.vn')) {
            this.stringQrCode += '_' + environment.root;
          }

          this.secretDialog.show();
        } else {
          this.app_service.showMessageById('MSG.AL_LAYMATHIETBILOI', APPCONSTS.TOAST_TYPE_ERROR);
        }
      }.bind(this)
    );
  }

  /**
   * This method is for sending event to a kiosk device
   * @param id device id
   * @param action send action
   * @param msg_id success message id
   */
  deviceSendEvent(id, action, msg_id) {
    const url = this.app_service.Based_URLs.socket.api + URIS.socket.deviceAction;
    const params = {id: id, action: action};

    this.app_service.getAPIPromise(url, params, msg_id).then(
      function(data) {
        this.app_service.successCase(data, msg_id);
      }.bind(this),
      function(err) {}
    );
  }

  /**
   * Open goto survey server dialog
   * @param item
   */
  gotoSurveyServer(item) {
    this.object = this.object_type.newObject(this.injector);
    const url = this.app_service.Based_URLs.auth + URIS.oauth.deviceInviteToken;
    const params = {'device_id': item.id};
    this.app_service.postAPI(url, params,
      function(data) {
        this.app_service.showMessageById('MSG.AL_SURVEY_SERVER_SUCCESS', APPCONSTS.TOAST_TYPE_INFO);
        this.object.data.surveyServer = this.app_service.Based_URLs.survey_web + '/?token=' + data.token;
        this.object.data.token = data.token;
        this.surveyServerDialog.show();
      }.bind(this),
      function(data) {
        this.app_service.showMessageById('MSG.AL_SURVEY_SERVER_FAILURE', APPCONSTS.TOAST_TYPE_ERROR);
      }.bind(this)
    );
  }
  /** Show short link goto survey server */
  enableShortUrl() {
    const url = this.app_service.Based_URLs.main + URIS.main.device_link_create;
    const params = {'link':  this.object.data.token};
    this.app_service.postAPI(url, params, function(data) {
      this.object.data.surveyServerShort = this.app_service.Based_URLs.shortURL_root + data.id;
    }.bind(this));
  };
}
