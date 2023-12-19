import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

// import { User } from '../_models';
import { environment }  from '@env/environment';
import { APPCONSTS } from './app.const';
import { URIS } from './uris.const';
import { I18nService } from './i18n.service';
import { Plugin } from '@app/_models';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 2 Apr 2020
 * @purpose API services, middle service to work with backend apis.
 * - init backend configuration
 * - working with APIs, backend
 */
@Injectable({ providedIn: 'root' })
export class APPService {
  public Based_URLs: any;
  public fbClientID: string;

  // Current organization that user is working on. Updated when user change organization
  public working_org: any;
  public user_roles: [String];

  /**
   * Language configuration for device
   */
  device_default_language: any;   // Default language
  device_langs: [];               // Languages used or device

  /**
   * Report plugins - plugins were configured in system configuration
   * This variable is loaded when default container is loaded, in order to decide left side menu
   */
  report_plugins: Plugin[];

  constructor(private http: HttpClient,
    public translate: TranslateService,
    public i18n: I18nService,
    public toastr: ToastrService
    ) {
    this.Based_URLs = environment.URLs;
    this.apiURL_config(environment.root);
  }

  // Set new api based on root URL
  apiURL_config(root) {
    if (!root)      return;
    
    this.Based_URLs.main = 		root + "/main/";
    this.Based_URLs.auth = 	root + "/oauth/";
    this.Based_URLs.front = 	root + "/front/";
    this.Based_URLs.imgs = 	root + "/img/";
    this.Based_URLs.user = 	root + "/user/";
    this.Based_URLs.socket = 	{
      root: root,
      path: "/comm/socket.io",
      api: root + "/comm"
    };
  }

  // Assign new value
  app_reconfig(key, value) {
    this[key] = value;
  }

  // Processing API error message for app requests with status of 400 
  err_processor(err) {
    let err_code = err.code;
    let msg_code = "MSG.GENERAL_API_ERROR"

    // Ignore error code in exceptional list
    if (APPCONSTS.EXCEPTIONAL_ERROR_CODES.indexOf(err_code) > -1)    return;

    if (err_code) {
      msg_code = "API_ERR." + err_code;
      // console.log("Request error code: ", err_code);
      this.showMessageById(msg_code, APPCONSTS.TOAST_TYPE_ERROR, err.message,
        {timeOut: APPCONSTS.TOAST_ERROR_TIMEOUT});  
    } else if (err.message) {
      this.showErrorMessage(err.message)
    } else {
      this.showMessageById(msg_code, APPCONSTS.TOAST_TYPE_ERROR, 
        {timeOut: APPCONSTS.TOAST_ERROR_TIMEOUT});      
    }
  }

  /**
   * Show error message with default timeout
  */
  showErrorMessage(msg) {
    let toast_option = { timeOut: APPCONSTS.TOAST_ERROR_TIMEOUT};
    this.toastr.show(msg, '', toast_option, APPCONSTS.TOAST_TYPE_ERROR);
  }

  // Show message using toast library
  showMessage(msg, type, option=null) {
    let toast_option = {...{ timeOut: APPCONSTS.TOAST_INFO_TIMEOUT}, ...option};
    this.toastr.show(msg, '', toast_option, type);
  }

  /**
   * Show message by message ID, using toast library
   * - msg_id: id of message; 
   * - type: 'toast-error' (default), 'toast-success', 'toast-warning'
   **/
  showMessageById(msg_id, type='toast-success', default_msg=null, option=null) {
    let msg = this.translate.instant(msg_id);
    if (msg==msg_id)   msg = default_msg || this.translate.instant("MSG.GENERAL_ERROR");
    
    let toast_option = {...{ timeOut: APPCONSTS.TOAST_INFO_TIMEOUT}, ...option};
    this.toastr.show(msg, '', toast_option, type);
  }

  /**
   * Display success message
  */
  showSuccessMessage() {
    this.showMessageById("MSG.UPDATE_OBJECT", 'toast-success');
  }

  /**
   * return org_id of working organization
   * */ 
  public getWorkingOrg_Id() {
    let org_id = localStorage.getItem( APPCONSTS.LOCAL_STORAGE_KEYS.WORKING_ORG_ID);
    return org_id;
  }

  static getWorkingOrg_Id() {
    let org_id = localStorage.getItem( APPCONSTS.LOCAL_STORAGE_KEYS.WORKING_ORG_ID);
    return org_id;
  }

  /**
   * This call to http get api and return an obserable object
   * params: is a dictionary that keeps values for interpolating URI
   */ 
  public getAPI_Observable(url_template, params=null) {
    let api_url = url_template;
    if (params) {
      for (let name in params) {
        let value = params[name];
        api_url = api_url.replace("{" + name + "}", value);
      }
    }
    return this.http.get(api_url);
  }

  /**
   * This call to http get api and return a promise object
   * params: is a dictionary that keeps values for interpolating URI
   **/ 
  public getAPIPromise(url_template: string, params=null, msg_id=null) {
    let api_url = url_template;
    if (params) {
      for (let name in params) {
        let value = params[name];
        api_url = api_url.replace("{" + name + "}", value);
      }
    }
    return this.http.get(api_url).toPromise();
  }

  /**
   *  This call to http post api and return an obserable object
   * */
  public postAPI_Observable(api_url, data=null) {
    return this.http.post(api_url, data);
  }

  /**
   * This function call post API, process success case and fail case
   * Return a promise
   */
  public postAPI(api_url, data, successCallBack=null, errorCallBack=null, options=undefined) {
    return this.http.post(api_url, data, options).toPromise()
      .then((res) => {
        if (successCallBack)    successCallBack(res);
        return res;

      },(err) => {
        if (errorCallBack)      errorCallBack(err);
        return err;
        
      })
  }


  /**
   * Get current organization
   * - callback parameter: is success call back function
   * - Return a promise
   */
  getOrganizationById(org_id) {
    let url = this.Based_URLs.main + URIS.main.organization_info;

    let payload = { org_id: org_id }
    return this.postAPI_Observable(url, payload).toPromise().catch((error) => {
      console.log("Got error");
    });
  }

  /**
   * Update user data
  */
  public updateUserInformation(data) {
    let url = this.Based_URLs.auth + URIS.auth.update_user_info;
    return this.postAPI_Observable(url, data).toPromise().catch((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
    });
  } 

  /**
   * Get user's token
   * */  
  public getToken() {
    let token = localStorage.getItem( APPCONSTS.LOCAL_STORAGE_KEYS.AUTH_TOKEN );
    return token;
  }

  /**
   * Update default language for user into database
   * - This function is called when user change language
   * - It's registered to i18n Service
  */
  public updateUserDefaultLanguage() {
    let user_token = this.getToken();
    if (!user_token)    return;     // User has not logged

    // Update language to user's default language
    let lang_id = this.i18n.lang.lang_id;
    this.updateUserInformation({ default_lang: lang_id });
  }

  public successCase(data, DEFAULT_MSG_ID) {
    var code = 'APP.NT_SUCCESS';
    if (DEFAULT_MSG_ID)	code = DEFAULT_MSG_ID;
    if (data && data.code) code = 'SUCCESS.' + data.code;
    this.showMessageById(code, APPCONSTS.TOAST_TYPE_INFO);
  };


}
