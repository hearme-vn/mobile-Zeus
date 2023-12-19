// import { map } from 'rxjs/operators';
// import { Injector, OnInit } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';

// import { User } from '@app/_models';
// import { APPService, APPCONSTS, I18nService } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 4, 2020
 * @purpose Base model is used for all object model
 */

/**
 * Most common model
*/
class CommonModel {

  public constructor(init=null) {
    if (init)
      Object.assign(this, init);
  }

  /** Create new model */
  public static newModel<T extends CommonModel>(this: new (init_data: any) => T, init_data: any=null): T {
    let self = new this(init_data);
    if (init_data)
      self = Object.assign(self, init_data);
    return self;
  }  

}

/**
 * Base Model for database Objects in application: Survey, device, organization...
*/
class BaseModel  {

  /**Raw json data from DB*/
  raw_data: any;

  /** Common fields for every object */
  public id: string;
  public created: Date;
  public status: Number;

  /** organization id that this object belong to
   * - If this field is null: this object belong to private organization
   * - If this field is a hash string, this object belong to an organization (can be private or enterprise)
  */
  org_id: string;

  /** id of user who created this object*/
  user_id: string;

  // Extension properties - created for processing
  checked: Boolean;

  static create_fields = null;
  static update_fields = null;
  
  constructor( raw_data=null ) {
    if (raw_data) {
      // Store raw data
      this.raw_data = raw_data;

      // Convert raw data into object properties
      Object.keys(raw_data).forEach((key) => {
        this[key] = raw_data[key]
      })
    } else {
      this.created = new Date();
      this.status = 0;
      this.init();
    }
    this.afterInitModel();
  }

  /**
   *  Initdata for new model, called if there is not raw_data
  */
  init() {}

  /**
   * After contructor: process data, this method is called in all cases, after constructor script
  */
  afterInitModel() {}

  /** Create new model */
  public static newModel<T extends BaseModel>(this: new (raw_data: any) => T, raw_data: any=null): T {
    const self = new this(raw_data);
    return self;
  }  
}

export { CommonModel, BaseModel }