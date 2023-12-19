import { Component, Injector, ViewChild } from '@angular/core';
import { TablePageComponent } from '@app/_bases';
import { PermissionModel, Role } from '@app/_models';

@Component({
  selector: 'role-list',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.css']
})
export class RoleComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Role;
  org_id: string;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /** Load Roles into tole list - GET method */
  loadMore() {
    this.org_id = this.authenticationService.working_organization.id;
    if (this.nextOffset) {
      this.nextOffset = false;
      let url = this.app_service.Based_URLs.auth + Role.uri_list;
      this.app_service.getAPIPromise(url, {'org_id': this.org_id}).then(
        function(res) {
          this.insertObjectsToList(res);
        }.bind(this)
      );
    }
  }

  /** Load supportive data */
  loadSupportiveData() {    
    this.getDevicelist(null);
  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForCreatingObject() {
    // this.object = new Role(this.injector, {});

    if (!this.survey_list || !this.survey_list.length)    this.getSurveylist();
    if (!this.group_list || !this.group_list.length)     this.getGrouplist();
  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForUpdatingObject() {
    // Configure for monitor permission
    if (this.object.data.permission_models[PermissionModel.PERMISSION_IDS.MONITOR]) {
      let monitor = <PermissionModel>this.object.data.permission_models[PermissionModel.PERMISSION_IDS.MONITOR];
      if (monitor.device_id) {
        // Set id for group device
        monitor.group_id = this.getGroupIDByDeviceID(monitor.device_id);
      }
    }

    if (!this.survey_list || !this.survey_list.length)    this.getSurveylist();
    if (!this.group_list || !this.group_list.length)     this.getGrouplist();
  }

  /**
   * tongle permisson: allow add/remove permissions in roles
  */
  togglePermission(permission_id) {
    if (this.object.data.permission_models[permission_id]) {
      // Delete permission
      delete this.object.data.permission_models[permission_id];
    } else {
      // Create new permission
      let permission_data = {};
      if (permission_id==PermissionModel.PERMISSION_IDS.MONITOR) {
        permission_data = {
          permission_id: permission_id,
          resource_id: ((this.group_list && this.group_list.length)? this.group_list[0].id : null),
          resource_type: PermissionModel.RESOURCE_TYPES.GROUP,
          action: "all"
        }
      } else {
        permission_data = {
          permission_id: permission_id,
          resource_id: this.org_id,
          resource_type: PermissionModel.RESOURCE_TYPES.ORGANIZATION,
          action: "all"
        }
      }
      let permission = new PermissionModel(permission_data);
      permission.org_id = this.org_id;
      this.object.data.permission_models[permission_id] = permission;
    }
  }

  /**
   * Change group, reset device id
  */
  changeGroup(group_id) {
    if (!group_id)  return;

    this.getDevicelist(group_id, function() {
      this.object.data.permission_models[PermissionModel.PERMISSION_IDS.MONITOR].device_id = undefined;
    }.bind(this));
  }

  /**
   * @returns URL for deleting object
   */
  public get_URL_deleting() {
    return this.app_service.Based_URLs.auth + this.object_type.uri_delete;
  }

}
