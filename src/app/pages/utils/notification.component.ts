import {Component, Injector, ViewChild} from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';
import { DefaultLayoutComponent } from '@app/containers';
import {TablePageComponent} from '@app/_bases';
import {Notification} from '@app/_models/notification.model';
import {URIS} from '@app/_services';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing notifications
 */
@Component({
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.css']
})
export class NotificationComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Notification;
  fbLink = null;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Set data when open update dialog */
  initDataForUpdatingObject() {
    if (this.object.data.status === 0) {
      const param = {
        ids: [this.object.data.id],
        status: 1
      };
      const notify_update = this.app_service.Based_URLs.main + URIS.main.notify_update;
      this.app_service.postAPI(notify_update, param, function(res) {
        this.object.data.status = 1;
      }.bind(this));
    }
    this.fbLink = this.object.data.feedback_id ? '#/' + URIS.user.feedback_detail + '?id=' + this.object.data.feedback_id : null;
  }

  /**
   * Delete notification objects, using backend API
   * Delete multiple items in a time
   * Purpose: For redundency
  */
   deleteObjects(ids) {
    const param = {
      ids: ids
    };
    const delete_url = this.app_service.Based_URLs.main + Notification.url_delete_items;
    return this.app_service.postAPI(delete_url, param, function(res) {
      this.creating_Dialog.hide();
      this.search();
      this.updateHeaderNotificationStatus();
    }.bind(this));
  }

  /**
   * Update header notification status
  */
  private updateHeaderNotificationStatus() {
    let default_container = this.injector.get(DefaultLayoutComponent);

    default_container.getNotifyCount();
    default_container.gotoNotifyPage();
  }

}
