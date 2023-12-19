import { Injector } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';

// import { User } from '@app/_models';
import { APPService, APPCONSTS, I18nService, URIS } from '@app/_services';
import { BaseModel } from './base.model';
// import { Configure } from './configure.model';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 9, 2020
 * @purpose Base Object. It is used for manipolating with model
 */
export class BaseObject  {
  /** for working with back end APIs */
  public injector: Injector;
  public app_service: APPService;

  /*** App constants definition */
  private APPCONSTS = APPCONSTS;    

  /** URL for creating object */
  // url_creating: String;

  /** URL for updating object */
  // url_updating: String;

  /** URI for manipulating object */
  static uri_create: String;
  static uri_update: String;
  static uri_delete: String;
  static uri_info: String;
  static uri_list: String;

  /** Table and column to update language */
  static tableLang: String;
  static columnLang: String;

  /** model data for this object */
  public model_type = BaseModel;

  /** Store model data for this object*/
  public data: BaseModel;
  public data_old: any;

  constructor( injector: Injector, raw_data, ...args: any[]
    ) {
    this.injector = injector;
    this.app_service = injector.get(APPService);
    this.data = this.model_type.newModel(raw_data);
    this.data_old = {...this.data};
  }

  /**
   * Validate data before creating object
   * Return False if data is not valid, else return True
  */
  validatedata() { return true};

  /**
   * @return URL for creating object
  */
  public getCreatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.main + base.uri_create;
  }

  /**
   * @return URL for updating object
  */
  public getUpdatingURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.main + base.uri_update;
  }

  /**
   * @return URL for updating object
  */
  public getObjectInfoURL() {
    let base = <typeof BaseObject>this.constructor;
    return this.app_service.Based_URLs.main + base.uri_info;
  }

  
  static getObjectInfoById(id) {

  }

  /**
   * Get Main Full URL from URI
  */
  public getMainURL(uri) {
    return this.app_service.Based_URLs.main + uri;
  }


  /**
   * Prepare data before create object
   * */ 
  preCreate() {}

  /**
   * Creat object, using backend API 
  */
  create(postCreate=null, method="POST") {
    if (!this.validatedata())   return;

    const successCallback = function (_this, res, postCreate) {
      // console.log("created new object: ", res);
      _this.app_service.showMessageById("MSG.CREATED_OBJECT", 'toast-success');
      _this.data.id = res.id;            // Update data for itself
      if (_this.data.raw_data) {
        _this.data.raw_data.id = res.id;
      }
      _this.postCreate(res);
      if (postCreate)   postCreate(res);
    }

    this.preCreate();

    // console.log("Creating object data: ", this);
    const payload = this.makePayload(this.model_type.create_fields);
    if (method=="GET") {
      return this.app_service.getAPI_Observable(this.getCreatingURL(), payload).subscribe(function(res) {
        successCallback(this, res, postCreate)
      }.bind(this));
    } else if (method=="POST") {
      return this.app_service.postAPI(this.getCreatingURL(), payload, function(res) {
        successCallback(this, res, postCreate);
      }.bind(this));
    }
  }
 
  /**
   * Check and then create configures for object, after creating object
  */
  createObjectConfigures() {
    let object = <any>this.data;
    if (!object || !object.id)    return;
    
    if (object && object.configures && object.configures.length) {
      for (let config of object.configures) {
        config.data.object_id = object.id;
        config.create();
      }
    }
  }

  /**
   * Interceptor for processing after creating object
   * @data Object data returned by creating api
  */
  postCreate(data) {}

  /**
   * Prepare data before update object
   * */ 
  preUpdate() {}

  /** Create payload from object data */
  makePayload(fields) {
    // if (!this.model_type.update_fields || !this.model_type.update_fields.length || !this.data)    return this.data;
    if (!fields || !fields.length || !this.data)    return this.data;

    let payload = {};
    for (let attr of fields) {
      payload[attr] = this.data[attr]
    }

    return payload;
  }

  /**
   * Update model into backend, using backend API
  */
  update(postUpdate=null) {
    if (!this.validatedata())   return;

    this.preUpdate();

    const payload = this.makePayload(this.model_type.update_fields);
    // console.log("Updating object data: ", this);
    return this.app_service.postAPI(this.getUpdatingURL(), payload, function(res) {
      // console.log("created new object: ", res);
      this.app_service.showMessageById("MSG.UPDATE_OBJECT", 'toast-success');

      // Update new data to old one
      Object.keys(res).forEach((key) => {
        this.data[key] = res[key]
        this.data.raw_data[key] = res[key];
      })

      this.postUpdate(res);
      if (postUpdate)   postUpdate(res);
    }.bind(this));

  }

  /**
   * Interceptor for processing after updating object successfull
   * @resData Object data returned by updating api
  */
  postUpdate(res) {}

  /**
   * Update model into backend, using backend API
  */
  delete() {
    console.log("Delete object: ", this);
  }


  /**
   * Get configures for this object, then store in raw_data field in data object
  */
  getObjectConfigures() {
    if (!this.data.id)   return;

    let filter = {
      "object_id": this.data.id
    };
    let url = this.app_service.Based_URLs.main + URIS.main.configure_list;
    return this.app_service.postAPI(url, filter).then (
      function(configures) {
        this.data.raw_data.configures = configures;
      }.bind(this)
    );
  }  

  /** Create new object */
  public static newObject<T extends BaseObject>(this: new (injector, raw_data, ...args) => T, injector, raw_data=null, ...args: any[]): T {
    const self = new this(injector, raw_data, args);
    return self;
  }
  
}
