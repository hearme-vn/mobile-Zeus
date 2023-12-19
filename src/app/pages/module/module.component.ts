import {Component, Injector, ViewChild} from '@angular/core';
import {BaseComponent, TablePageComponent} from '@app/_bases';
import {APPCONSTS, Utils} from '@app/_services';
import {Tabs} from '@app/_models/tabs.model';
import {Device, Group, Label} from '@app/_models';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  templateUrl: 'module.component.html',
  styleUrls: ['module.component.css']
})
export class ModuleComponent extends BaseComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Tabs;

  /** Structure of filtering form fields */
  filtering_form = {
    group_id: '',
    device_id: ''
  };

  /** Selected language for add/edit image */
  current_lang_code = null;
  selected_lang = null;

  objectFB: any = this.object_type.newObject(this.injector);
  objectCOL: any = this.object_type.newObject(this.injector);

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * Change language for image
   **/
  changeFactorLanguage(lang) {
    this.current_lang_code = lang.code;
  }

  /** Load supportive data */
  loadSupportiveData() {
    this.getGrouplist();
  }

  /**
   * Load more Tab objects for: Feedback tab and Collection tab
   **/
  loadMainPageObjects() {
    this.searchPrams();
    let url = this.getListingURL();
    this.app_service.getAPIPromise(url, this.params).then(function(data) {
      this.insertObjectsToList(data);
    }.bind(this));
  }

  /** load initial labels */
  loadInitialLabels(data) {
    data.lang_texts = [];
    data.lang_text_links = Label.createLabelListForUI(data.lang_texts);
    Label.loadInitialLabels(this, this.object_type.tableLang, this.object_type.columnLang, data.id, function(res) {
      data.lang_texts = res;
      data.lang_text_links = Label.createLabelListForUI(data.lang_texts);
    }.bind(this));
  }

  /**
   * Process raw data of Tab objects from database:
   * - Store in objectFB, objectCOL
   * - Load labels for objects
   */
  insertObjectsToList(data) {
    // super.insertObjectsToList(data);
    if (!data || !data.length) {
      this.objectFB = this.object_type.newObject(this.injector);
      this.objectCOL = this.object_type.newObject(this.injector);
      this.objectCOL.data.col_check = false;
      this.loadInitialLabels(this.objectFB.data);
      this.loadInitialLabels(this.objectCOL.data);
    } else {
      for (let obj of data) {
        if (obj.function == 0) {// feedback
          this.objectFB = this.object_type.newObject(this.injector, obj);
          this.loadInitialLabels(this.objectFB.data);
        } else if (obj.function == 1) {// collection media
          this.objectCOL = this.object_type.newObject(this.injector, obj);
          this.objectCOL.data.col_check = this.objectCOL.data.status == 0 ? true : false;
          this.loadInitialLabels(this.objectCOL.data);
        }
      }
    }
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (!this.filtering_form || !this.filtering_form.device_id) {
      if (this.filtering_form && this.filtering_form.group_id) {
        // Set id to group ID
        this.params = { id: this.filtering_form.group_id };

      } else {
        if (this.authenticationService.working_organization.type==APPCONSTS.ORGANIZATION_TYPE_ENTERPRISE) {
          // Set id to enterprise organization id
          this.params = { id: this.authenticationService.working_organization.id};

        } else {
          // Set id to null - private organization 
          this.params = { id: 'null' };

        }
      }
    } else {
      // Set id to device ID
      this.params = { id: this.filtering_form.device_id };
    }
  }

  /** reload objects after change group or device */
  changeGroup() {
    this.filtering_form.device_id = '';
    this.getDevicelist(this.filtering_form.group_id);
    this.loadMainPageObjects();
  }

  changeDevice() {
    this.loadMainPageObjects();
  }

  /** Save data */
  proccess() {
    var obj = null;
    if (this.device_list.length > 0) {
      if (this.filtering_form.device_id == '') {
        obj = this.filtering_form.group_id;
      } else {
        obj = this.filtering_form.device_id;
      }
    } else if (this.group_list.length > 0) {
      if (this.filtering_form.group_id != '') {
        obj = this.filtering_form.group_id;
      }
    }

    if (!this.objectFB.data.id) {
      this.objectFB.data.function = 0;
      this.objectFB.data.object_id = obj;
      this.objectFB.create();
    } else {
      this.objectFB.update();
    }

    this.objectCOL.data.status = this.objectCOL.data.col_check ? 0 : 1;
    if (!this.objectCOL.data.id) {
      this.objectCOL.data.function = 1;
      this.objectCOL.data.object_id = obj;
      this.objectCOL.create();
    } else {
      this.objectCOL.update();
    }
  }
}
