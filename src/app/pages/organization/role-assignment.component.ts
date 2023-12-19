import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Role} from '@app/_models';
import {RoleAssignment} from '@app/_models/role_assignment';
import {URIS} from '@app/_services';

@Component({
  selector: 'role-assignment-list',
  templateUrl: 'role-assignment.component.html',
  styleUrls: ['role-assignment.component.css']
})
export class RoleAssignmentComponent extends TablePageComponent {

  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = RoleAssignment;
  role_list = [];

  /** Structure of filtering form fields */
  filtering_form = {
    role_id: ''
  };

  form_data = {
    search_text: '',
    user_list: [],
  };

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /**
   * @return URL for getting object list
   */
  public getListingURL() {
    return this.app_service.Based_URLs.auth + this.object_type.uri_list;
  }

  loadSupportiveData() {
    // Load role group list
    let url = this.app_service.Based_URLs.auth + Role.uri_list;
    this.app_service.getAPIPromise(url, {'org_id': this.authenticationService.working_organization.id}).then(
      function(res) {
        this.role_list = res;
      }.bind(this)
    );
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (this.filtering_form.role_id) {
      this.params['role_id'] = this.filtering_form.role_id;
    } else {
      delete this.params['role_id'];
    }
  }

  /**
   * @returns URL for deleting object
   */
  public get_URL_deleting() {
    return this.app_service.Based_URLs.auth + this.object_type.uri_delete;
  }

  deleteData(obj) {
    let payload = {
      user_id: obj.id,
      role_id: obj.role_id
    };
    this.deleteObject(null, null, 'GET', payload);
  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForCreatingObject() {
    this.form_data.search_text = '';
    this.form_data.user_list = [];
  }

  // Search user
  searchUser() {
    this.form_data.user_list = [];
    this.object.data.user_id = '';

    if (!this.form_data.search_text) return;
    let url = this.app_service.Based_URLs.auth + URIS.auth.search_user;
    this.app_service.getAPIPromise(url, {'name': this.form_data.search_text}).then(
      function(res) {
        this.form_data.user_list = res;
      }.bind(this)
    );
  }
  clickUser(userId) {
    this.object.data.user_id = userId;
  }
  highlightSelectedUser(userId) {
    return this.object.data.user_id == userId ? 'active': '';
  }

  /**
   * Creat new object, using backend API
   */
  createObject(method='POST') {
    this.object.create(function(res) {
      if ([ 400, 401, 403, 500].indexOf(res.status) == -1 && res.ok !== false) {
        this.creating_Dialog.hide();
        this.search();
      }
    }.bind(this), method);
  }
}
