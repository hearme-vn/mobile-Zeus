import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Label, Organization} from '@app/_models';
import {APPCONSTS, Utils} from '@app/_services';

@Component({
  selector: 'organization-list',
  templateUrl: 'organization.component.html'
})
export class OrganizationComponent extends TablePageComponent {

  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('imgDialog') imgDialog;

  object_type = Organization;
  selectedOrg = null;
  selectedOrgId = null;
  selected_org_role = null;

  /** Selected language for add/edit image */
  current_lang_code = null;
  selected_lang = null;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /**
   * Load more objects when scroll down; search for next segment of objects
   **/
  loadMore() {
    this.selectedOrg = this.authenticationService.working_organization;
    this.selectedOrgId = this.selectedOrg.id;
  }

  /** Load supportive data */
  loadSupportiveData() {
    // Get device language configuration, in order to input survey question in suported languages
    this.getDeviceLanguages(function(device_default_language, device_langs) {
        this.current_lang_code = device_default_language.code;
        this.selected_lang = Utils.getLangByLangcode(this.device_langs, this.current_lang_code);
      }.bind(this)
    );

    this.getBusinessFields(null);
  }

  // Support change organization
  selectOrd(org) {
    this.selectedOrg = org;
    this.selectedOrgId = org.id;
  }
  changeOrganization() {
    if (this.selectedOrg) {
      this.authenticationService.setCurrentOrganization(this.selectedOrg);
    }
  }

  /**
   * Condition for display edit button
   * @param permissions
   */
  checkPermission(permissions) {
    if (!permissions)   return false;

    var res = permissions.split(",");
    for (var i = 0; i < res.length; i++) {
      var permission = res[i].trim();
      if (permission == "owner" || permission == "admin")  return true;
    }
    return false;
  }

  /**
   * Open select logo dialog
   */
  openCollection() {
    this.imgDialog.show();
  }
  /**
   * Set selected logo to data
   * @param fileName
   */
  setLogo(fileName) {
    this.object.data.logo = fileName;
    this.imgDialog.hide();
  }

  /**
   * Change language for image
   **/
  changeLanguage() {
    this.selected_lang = Utils.getLangByLangcode(this.device_langs, this.current_lang_code);
  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForCreatingObject() {
    this.loadInitialLabels();
  }

  /** This method will be called for initiating data before opening updating dialog */
  initDataForUpdatingObject() {
    this.loadInitialLabels();
  }

  /** load initial labels */
  loadInitialLabels() {
    this.object.data.lang_texts = [];
    this.object.data.lang_text_links = Label.createLabelListForUI(this.object.data.lang_texts, { value: this.object.data.name });
    Label.loadInitialLabels(this, this.object_type.tableLang, this.object_type.columnLang, this.object.data.id, function(res) {
      this.object.data.lang_texts = res;
      this.object.data.lang_text_links = Label.createLabelListForUI(this.object.data.lang_texts, { value: this.object.data.name });
    }.bind(this));
    // this.current_lang_code = this.app_service.device_default_language.code;
    // this.changeLanguage();
  }

  /**
   * Creat new object, using backend API
   */
  createObject() {
    this.object.create()?.then( function(res) {
      if ([ 400, 401, 403, 500].indexOf(res.status) == -1 && res.ok !== false) {
        // console.log("new object is: ", res);
        this.authenticationService.initUserAccountAndOrganization();
        this.creating_Dialog.hide();
      }
    }.bind(this));
  }

  /**
   * Open org_roles object for editing organization informtion
   * Overloading this function
   * */ 
  openDialogForUpdating(org_roles) {
    this.object = org_roles.organization;
    this.selected_org_role = org_roles;

    super.openDialogForUpdating(this.object);
  }
}
