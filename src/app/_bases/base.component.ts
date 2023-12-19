// Angular libraries
import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, NavigationEnd, ActivatedRoute, ParamMap } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';

// Third party libraries
// import { InfiniteScroll } from 'ngx-infinite-scroll';

import {BaseObject, Device, Group, Survey, SurveyModel, TimeFilter, UserModel} from '@app/_models';
import { APPService, URIS, APPCONSTS, I18nService, AuthenticationService, Utils } from '@app/_services';
import { Configure } from '@app/_models/configure.model';
import * as dayjs from 'dayjs';
import { DomSanitizer } from '@angular/platform-browser';
// import { async } from '@angular/core/testing';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose Base component, will be extended by all page components
 * This provide common method for all components
 */
 @Component({
  template: ''
})
class BaseComponent implements OnInit {
  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public router: Router;

  public APPCONSTS = APPCONSTS;    // For use APPCONTS in template

  public translate: TranslateService;
  public i18n: I18nService;
  public toastr: ToastrService;

  /**
   * object type is defined in models folder
   * - If this is null, this class get list of object through uri_list defined in object type
   * - Other, this URL will be more priority
  */
  getlist_url = "";   
  form_data = {};
  nextOffset = true;
  params = null;

  /**
   * array of main objects for this page
  */
  objects = null;

  /**
   * Working object - a multi purpose property: 
   * used for cases such as creating new object, updating object
   * */
  object = null;

  /**
   * Hold reference to object that is updating
  */
  updating_object = null;

  /** object Type: 
   * - is defined in models folder 
   * - Type of object that this page mainly working on
  */
  object_type = BaseObject;

  /** Page parameters
   * */ 
  paramMap: ParamMap;

  /**
   * status: list of status for filtering object in form
  */
  status_list = [
    { name_key: 'APP.UI_STATUS_ACTIVE', value: 0 },
    { name_key: 'APP.UI_STATUS_INACTIVE', value: 1 }
  ]

  /**
   * - Device list keeps all device information that user has permisson.
   * - Used in many cases
   * */ 
  public device_list: any = [];

  public group_list: any = [];

  public survey_list: any = [];

  public business_fields: any = [];

  /** Default language for device */
  device_default_language: any;

  /** all language supported in device */
  device_langs: any[];

  /** Selected language for editing survey - in factor tab */
  current_lang_code = null;
  selected_lang = null;
  // selected_lang_idx = 0;

  /**
   * filtering_form: includes fields for filtering list of objects
  */
  filtering_form = {};

  /** Dialog handle for creating, updating object */
  creating_Dialog: ModalDirective;

  /** Dialog handle for showing object information */
  information_Dialog: ModalDirective;

  /**
   * flag indicate system is waiting for api response. Normally, it'is used for displaying spiner in button
  */
  waiting_response = false;

  /**
   * Survey types that are allowed to make reports
  */
  allowes_survey_types = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor( injector: Injector
    ) {

    this.injector = injector;
    this.app_service = injector.get(APPService);
    this.authenticationService = injector.get(AuthenticationService);

    // Store all dependency services
    this.translate = injector.get(TranslateService);
    this.i18n = this.app_service.i18n;
    this.toastr = this.app_service.toastr;
    this.router = injector.get(Router);
  }

  /**
   * Load object  data into page
  */
   loadMainPageObjects() {
    // start search
    // this.search();
  }

  /**
   * Load all supportive data, such as some list displayed in form 
  */
  loadSupportiveData() {}

  /**
   *  Search for list of main objects in page for management
   * - For example: if the derived component is customer management, this method will search for all customers
   * - All subsequence search for other segment will be processed by {@link BaseComponent.loadMore | loadMore() method} 
  */
  search() {}

  /**
   * 
   * @returns URL for deleting object
   */
  public get_URL_deleting() {
    return this.app_service.Based_URLs.main + this.object_type.uri_delete;
  }

  /**
   * @return URL for getting object list
  */
  public getListingURL() {
    return this.app_service.Based_URLs.main + this.object_type.uri_list;
  }

  /**
   * @return URL for getting object information
  */
  public getObjectInfoURL() {
    return this.app_service.Based_URLs.main + this.object_type.uri_info;
  }

  public getMainURL(uri) {
    return this.app_service.Based_URLs.main + uri;
  }

  /**
   * Get object information by id for Object type declared in this component through object_type property
   * @Return Observable object
  */
  public getObjectDataById(id) {
    const url = this.getObjectInfoURL();
    let data = { "id": id};
    return this.app_service.postAPI_Observable(url, data);
  }

  /**
   * Get object information by id - using get method API
   * Same as getObjectDataById, but apply for API with get method
   * @Return Observable object
  */
   public getObjectDataById_GETMETHOD(id) {
    const url = this.getObjectInfoURL();
    let data = { "id": id};
    return this.app_service.getAPI_Observable(url, data);
  }

  /**
   * Get object information by id and Object type
   * @input ObjectClass is object class that want to get information
   * @input id is object id
   * @input payload: is used for api. It's used if not null
   * */ 
  getObjectInfoById(ObjectClass: typeof BaseObject, id, payload=null) {
    let url = this.app_service.Based_URLs.main + ObjectClass.uri_info;
    if (!payload)   payload = { id: id };

    return this.app_service.getAPIPromise(url, payload);
  }

  /**
   * Load survey list in this organization
   * */ 
  getSurveylist(filter=null) {
    if (!filter)
      filter = {
        "status": SurveyModel.STATUS_LIST.ACTIVE
      };
    this.loadObjectsbyFilter(Survey, filter).subscribe(
      function(data) {
        this.survey_list = data;
      }.bind(this)
    );
  }

  /** Load group device list */
  getGrouplist(sur_id = undefined, callback = undefined) {
    this.group_list = [];
    const col_list_filter = {
      name: '*',
      sur_id: sur_id ? sur_id : undefined
    };
    this.loadObjectsbyFilter(Group, col_list_filter).subscribe(
      function(data) {
        this.group_list = data
        if (callback) callback();
      }.bind(this)
    );
  }

  /** Load device list */
  getDevicelist(grp_id = undefined, callback = undefined) {
    this.device_list = [];
    let col_list_filter = {
      status: '100',
      name: '*',
    };
    if (grp_id)   col_list_filter['grp_id'] = grp_id;
    this.loadObjectsbyFilter(Device, col_list_filter).subscribe(
      function(data) {
        this.device_list = data;
        if (callback) callback();
      }.bind(this)
    );
  }

  postDelete() {
    this.app_service.showMessageById("MSG.DELETE_OBJECT", 'toast-success');
    this.search();
  }

  /**
   * Delete object, using backend API - with GET, or POST API
  */
  deleteObject(id, errorCallBack=null, method="GET", payload=null, delete_uri=null) {
    let delete_url = this.get_URL_deleting();
    if (delete_uri)    delete_url = this.app_service.Based_URLs.main + this.object_type[delete_uri];

    if (!payload)   payload = {};
    payload.id = id;

    if (method=="GET") {
      return this.app_service.getAPIPromise(delete_url, payload).then(
        this.postDelete.bind(this),
        errorCallBack
      )  
    } else if (method=="POST") {
      return this.app_service.postAPI(delete_url, payload, this.postDelete.bind(this), errorCallBack);
    }
  }

  ngOnInit() {
    // console.log("Initialed view");

    // Load data here
    this.loadMainPageObjects();
    this.loadSupportiveData();
  }

  /**
   * Return Query param map subscrible and set param map for this class
   * @out Observable<ParamMap>
   * setting paramMap property
  */
  getQueryPramMap() {
    // Get survey id parameter and load survey
    let queryPram = this.injector.get(ActivatedRoute).queryParamMap;
    queryPram.subscribe(
      function(paramMap: ParamMap) {
        this.paramMap = paramMap;
      }.bind(this)
    )
    return queryPram;
  }  
  /**
   * Checking onboarding state for current organization
   * If there is not any feedback collected, just GOTO onboarding page
  */
  public checkingOnboardingState() {
    if (!this.authenticationService || !this.authenticationService.working_organization) {
      // Re-checking again after 200 miliseconds
      setTimeout(this.checkingOnboardingState.bind(this), APPCONSTS.TIMEOUT_SHORT);
      
    } else if (this.authenticationService.working_organization.fb_count <= 0) {
      let current_org = this.authenticationService.working_organization;
      // counting feedback in this organization
      let payload = {}
      let url = this.app_service.Based_URLs.front + URIS.front.update_organization_feedback_count;
      this.app_service.postAPI(url, payload,
        function(res) {
          // Checking onboarding state again
          if (res.feedback_count <= 0) {
            this.router.navigate([APPCONSTS.ONBOARDING_PAGE]);
            return true;
          }

          // Update feedback count to organization
          payload['feedback_count'] = res.feedback_count;
          let url = this.app_service.Based_URLs.main + URIS.main.organization_update_feedback_count;
          this.app_service.postAPI(url, payload);
        }.bind(this)
      );
    }
    return false;
  }

  /**
   * Get all objects that meet condition in params
   * */ 
  loadObjectsbyFilter(ObjectClass: typeof BaseObject, filterParams) {
    let url = this.app_service.Based_URLs.main + ObjectClass.uri_list;

    return this.app_service.postAPI_Observable(url, filterParams);
  }

  /**
   * Get first 100 surveys in database
   * */ 
  loadSurveyList() {
    const params = {
      limit: 100,
      offset: 0,
      question: '*',
      status: 1
    };
    this.survey_list = [];
    const survey_info = this.app_service.Based_URLs.main + Survey.uri_list;
    return this.app_service.postAPI(survey_info, params).then(
      function(res) {
        this.survey_list = res;
      }.bind(this)
    );
  }

  /**
   * Get Group id by device id. This method search device in device list and return it's group id
   * @input device id
   * @output group id
  */
  getGroupIDByDeviceID(device_id): string {
    if (!device_id || !this.device_list || ! this.device_list.length)  return null;

    for (let device of this.device_list) {
      if (device.id == device_id)    return device.grp_id
    }
    return null;
  }

  /**
   * Get configures for device languages
   * @output Default language and list of all device languages
  */
  async getDeviceLanguages(callBack=null) {
    const supported_langs = APPCONSTS.DEVICE_LANGUAGES;
    const english_lang_index = 1;

    // Get default language
    const filter_default_device_language = {
      cfg_key: "DEVICE_LANGUAGE_DEFAULT"
    }
    await this.loadObjectsbyFilter(Configure, filter_default_device_language).toPromise().then(
      function(ret) {
        // console.log("default language: ", ret);
        if (ret.length >0)  {
          const id = ret[0].value
          this.device_default_language = supported_langs[Number(id)];
        } else {
          this.device_default_language = supported_langs[english_lang_index];  
        }
        this.app_service.device_default_language = this.device_default_language;

        // Update current language
        this.current_lang_code = this.device_default_language.code;
        this.selected_lang = this.device_default_language;
        
        // console.log("Device default lang at: ", Date.now());
      }.bind(this)
    );

    // Get language list
    this.device_langs = [];
    const filter_device_langs = {
      cfg_key: "DEVICE_LANGUAGES"
    }
    this.loadObjectsbyFilter(Configure, filter_device_langs).subscribe(
      function(langs) {
        if (!langs || !langs.length) { 
          // Set default language to active language 
          // And set deveice_langs to array with defaul language
          for (let lang of supported_langs) {
            if (lang["default"]) {
              lang["active"] = true;
              this.device_default_language = lang;
              this.app_service.device_default_language = lang;
              this.device_langs = [lang];
              break;
            }
          }
        } else {
          // console.log("langs: ", langs);
          const lang_ids = langs[0].value;
          const ids = lang_ids.split(",");
          if (ids && ids.length) {
            for (let id of ids) {
              const lang = supported_langs[Number(id)];
              lang.active = true;
              this.device_langs.push(lang);
            }
          }
          // console.log("Device langs at: ", Date.now());
        }

        this.app_service.device_langs = this.device_langs;
        if (callBack)    callBack( this.device_default_language, this.device_langs );
      }.bind(this)
    );

  }

  /**
   * Copy string to clipboroard using capacitor plugin
   * */ 
  async copyToClipboard(str) {
    await Clipboard.write({ string: str });
    this.app_service.showMessageById('MSG.CLIPBOARD_COPIED', 'toast-success');

    // This piece of code copies string to clipboard using html script, can't run in native device
    // navigator.clipboard.writeText(str).then(() => {
    //   this.app_service.showMessageById('MSG.CLIPBOARD_COPIED', 'toast-success');
    // });
  }

  /**
   * Get list of business fields in this system and return to variable: business_fields
  */
  getBusinessFields(search, parent=null, limit=null, offset=null) {
    let url = this.app_service.Based_URLs.main + URIS.main.business_fields_list;
    let payload = {};
    if (search)   payload["search"] = search;
    if (parent != null)   payload["parent"] = parent;
    if ((limit != null) && (offset != null))    {
      payload["limit"] = limit;
      payload["offset"] = offset;
    }

    return this.app_service.postAPI(url, payload).then(
      function(res) {
        this.business_fields = res;
      }.bind(this)
    );
  }


  timeUnitChange(time_filter: TimeFilter) {
    if (time_filter.time_unit != 2) {
      time_filter.bias = TimeFilter.DEFAULT_BIAS[time_filter.time_unit];
    } else {
      time_filter.time_range = {start: dayjs().subtract(1, 'month'), end: dayjs()};
    }
  }

  /**
   * make safe, trusted URL by sanitizer
   * @input original_url as string type
   * @output safe URL that can be used in DOM, iFrame
  */
  getReportPluginURL(original_url: string) {
    if (!original_url)    return null;

    let sanitizer = this.injector.get(DomSanitizer);
    return sanitizer.bypassSecurityTrustResourceUrl(original_url);
  }

  /**
   * Send request for email validation
  */
  requestValidatingEmail(callBack = null, err_callback=null) {
    let url = this.app_service.Based_URLs.auth + URIS.auth.request_validate;
    this.waiting_response = true;
    let _this = this;

    this.app_service.getAPIPromise(url).then(
      (res) => {
        _this.app_service.showMessageById("MSG.SENT_EMAIL_VALIDATION");
        _this.authenticationService.currentUser.validated==UserModel.EMAIL_VALIDATION_STATE.VALIDATED;
        _this.waiting_response = false;

        if (callBack)   callBack(res);
      },
      (err) => {
        _this.waiting_response = false;
        if (err_callback)   err_callback(err);
      }
    );

  }
}

export {  BaseComponent };
