import { Injector, Component, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { interval } from 'rxjs';
// import { ModalDirective } from 'ngx-bootstrap/modal';

// import { environment }  from '@env/environment';

import { Customer } from '@app/_models';
import { BaseCSComponent } from '@app/_bases';
import { APPService, URIS, APPCONSTS, Utils } from '@app/_services';
// import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 26 May 2020
 * @purpose for managing customers
 */
@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent extends BaseCSComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Customer;

  /** Structure of filtering form fields */
  filtering_form = {
    keyword: null,
    status: 0
  }

  constructor(
    public injector: Injector,
    // app_service: APPService,
    // private formBuilder: FormBuilder,
    ) {
    super(injector);
  }

  searchPrams() {
    // console.log("Filtering form values are: ", this.filtering_form);
    if (this.filtering_form.keyword) 
      this.params["search"] = this.filtering_form.keyword
    else 
      delete this.params["search"];

    if (this.filtering_form.status != null || this.filtering_form.status != undefined)
      this.params["status"] = this.filtering_form.status
    else
      delete this.params["status"];
  }

  loadSupportiveData() {
    let filtering = {status: APPCONSTS.DEVICE_STATUS_ACTIVE, type: APPCONSTS.DEVICE_TYPE_KIOSK};
    this.loadDeviceListData(filtering);

    // Load invitation list
    let invitation_list = Utils.getLocalStorage(APPCONSTS.LOCAL_STORAGE_KEYS.INVITATION_LIST_KEY);
    if (invitation_list) {
      this.invitation_list = invitation_list;
    }
  }
  
  onScrollDown() {
    console.log('scrolled down!!');
    this.loadMore();
  }

  initDataForCreatingObject() {
    
  }

  initDataForUpdatingObject() {
    if (this.object.data.birthday)    this.object.data.birthday = new Date(this.object.data.birthday);
  }

  /** Open dialog for creating object */
  // openDialogForCreating() {
  //   this.working_object = new Customer(this.injector);
  //   this.initDataForCreatingObject();
  //   this.creating_Dialog.show();
  // }  
}
