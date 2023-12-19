// Angular libraries
import { Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
// import { ModalDirective } from 'ngx-bootstrap/modal';

import {BaseObject} from '@app/_models';
// import { APPService, URIS, APPCONSTS, I18nService, AuthenticationService } from '@app/_services';
import { BaseComponent } from '@app/_bases';
import { Subscription } from 'rxjs';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 21 Dec 2022
 * @purpose This provide general class used for List UI components, such as: Survey list UI, Device List UI,...
*/
@Component({ template: ''})
export class ListUI extends BaseComponent implements ControlValueAccessor, OnChanges {
  _response_sub: Subscription;

  /**
   * array of main objects for this page
  */
  @Input('pre_objects') pre_objects = null;
  @Input('form_data') form_data: any;       // data used for filtering object list - used by get list API

  // emit event of changing survey, and transfer survey object
  @Output('change') change = new EventEmitter();

  /**
   * selected object
   * */
  object = null;

  /** object Type: 
   * - is defined in models folder 
   * - Type of object that this page mainly working on
  */
  object_type = BaseObject;

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  constructor (public injector: Injector) {
    super(injector);
  }

  public get ngModel(): string { return this.object }
  public set ngModel(v: string) {
    if (v !== this.object) {     
      this.object = v;
      this._onChange(v);
    }
  }  

  writeValue(value: any): void {    
    this.ngModel = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  /**
   * hanlde event on change survey selection
  */
  changeSelectedObject($event) {
    this.change.emit(this.object);
  }

  /**
   * Make params for getting list of objects
   */ 
  initParams() {
    return Object.assign(this.form_data, {
      "offset": 0,
      "limit": this.APPCONSTS.FIRSTLOAD_COUNT
    })
  }
  
  /**
   * Load object  data into page
  */
  loadMainPageObjects() {
  }

  /**
   *  Search for list of main objects in page for management
   * - For example: if the derived component is customer management, this method will search for all customers
   * - All subsequence search for other segment will be processed by {@link BaseComponent.loadMore | loadMore() method} 
  */
  search() {
    // Init search state
    this.nextOffset = true;
    this.objects = null;
    
    // Making search parameters
    this.params = this.initParams();
    
    // start search
    this.loadMore();
  }
  
  /**
  * Insert new object list into current list. Apply when scroll down page
  */
  insertObjectsToList(data) {
    if (data.length==this.params.limit) {
      this.params.offset += this.params.limit;
      this.params.limit = this.APPCONSTS.LOADMORE_COUNT;
      this.nextOffset = true;
    }
      
    if (this.objects == undefined || this.objects == null) {
      this.objects = data;
    } else {
      if(data.length > 0){
        this.objects = this.objects.concat(data);
      }
    }
  }
    
  /**
   * Load more objects when scroll down; search for next segment of objects
   **/ 
  loadMore() {
    // Don't search if there are object list assigned
    // if (this.pre_objects && this.pre_objects.length)    return;
    if (this.pre_objects)   return;

    let url = this.getListingURL();

    if (this.nextOffset) {
      this.nextOffset = false;
      // this.app_service.postAPI(url, this.params, this.insertObjectsToList.bind(this));
      this._response_sub = this.app_service.postAPI_Observable(url, this.params).subscribe(
        function(data) {
          this.insertObjectsToList(data);
        }.bind(this)
      );      
    }
  }

  onScrollDown() {
    // console.log('scrolled down!!');
    this.loadMore();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.objects = null;
    if (this._response_sub)     this._response_sub.unsubscribe();
    
    // Don't search if there are object list assigned
    // if (this.pre_objects && this.pre_objects.length) {
    if (this.pre_objects) {
      this.objects = this.pre_objects;
      return
    };

    // start search
    this.search();  
  }
}
