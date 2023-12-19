import {Component, ElementRef, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Collection, CollectionModel, Label, Theme} from '@app/_models';
import {ParamMap} from '@angular/router';
import {Image} from '@app/_models/image.model';
import {URIS, Utils} from '@app/_services';
import {CdkDragDrop, CdkDragEnter, CdkDragMove, moveItemInArray} from '@angular/cdk/drag-drop';
import {FileHandle} from '@app/_bases';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 02 Nov 2022
 * @purpose for managing images in a collection
 */
@Component({
  templateUrl: 'images.component.html',
  styleUrls: ['images.component.css']
})
export class ImagesComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  collection_id = '';
  collection: any = {};

  object_type = Image;

  /** Selected language for add/edit image */
  current_lang_code = null;
  selected_lang = null;

  previewImage = '';
  files: FileHandle[] = [];

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  loadMainPageObjects() {
    this.getQueryPramMap().subscribe(
      function(paramMap: ParamMap) {
        if (paramMap.get('id')) {
          this.collection_id = paramMap.get('id');
          this.search();
        }
      }.bind(this)
    );

    // Get device language configuration, in order to input survey question in suported languages 
    this.getDeviceLanguages();
  }

  /**
   * Get images in collection
   * */ 
  search() {
    if (!this.collection_id)    return; 

    // Load images in this collection
    this.app_service.getAPIPromise(this.getMainURL(Image.uri_list), {'id': this.collection_id}).then(
      function(images) {
        this.objects = images;
      }.bind(this)
    );
  }


  postDelete() {
    this.app_service.showMessageById("MSG.DELETE_OBJECT", 'toast-success');
    this.search();
    this.creating_Dialog.hide();
  }  

  /**
   *  Append new object to the end of object list
   */
  appendNewObject(new_object) {
    // Add new object to object list
    if (this.objects && this.objects.length)
      this.objects.push(new_object)
    else
    this.objects = [new_object];
  }

  /** Load initial labels */
  loadInitialLabels() {
    this.object.data.title_texts = [];
    this.object.data.title_text_links = Label.createLabelListForUI(this.object.data.title_texts);

    // If this object is existed, get labels
    if (this.object.data.id) {
      Label.loadInitialLabels(this, this.object_type.tableLang, this.object_type.columnLang, this.object.data.id, function(res) {
        this.object.data.title_texts = res;
        this.object.data.title_text_links = Label.createLabelListForUI(this.object.data.title_texts);
      }.bind(this));      
    }


  }

  /** This method will be called for initiating data before opening creating dialog */
  initDataForCreatingObject() {
    this.previewImage = '';
    this.files = [];
    this.object.data.type = 0;
    this.object.data.col_id = this.collection_id;
    this.object.data.post_order = this.getNextOrder();
    this.loadInitialLabels();
  }

  /** This method will be called for initiating data before opening updating dialog */
  initDataForUpdatingObject() {
    this.loadInitialLabels();
  }

  /**
   * Handle for drag and drop image
   */
  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };
    console.log('dragEntered', { dragIndex, dropIndex });

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);

      moveItemInArray(this.objects, dragIndex, dropIndex);
      this.objects.forEach((img, idx) => {
        console.log('Original order: %s, new order: %s', img.post_order, idx + 1);
        if (img.post_order != idx + 1) {
          img.post_order = idx + 1;
          this.app_service.postAPI(this.getMainURL(this.object_type.uri_update), {id: img.id, post_order: img.post_order});
        }
      });
    }
  }
  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }
  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }

  /**
   * Change language for image
   **/
  changeFactorLanguage(lang) {
    this.selected_lang = lang;
    this.current_lang_code = lang.code;

    // this.selected_lang = Utils.getLangByLangcode(this.device_langs, this.current_lang_code);
  }

  /**
   * Drop or choose file to upload
   */
  filesDropped(files: FileHandle[]) {
    this.setFile(files[0].file);
  }
  chooseImage() {
    document.getElementById('postFile').click();
  }
  setFile(file) {
    this.object.data.postFile = file;
    const reader = new FileReader();
    reader.onload = function(event) {
      this.previewImage = event.target.result;
    }.bind(this);
    reader.readAsDataURL(file);
  }

  /**
   * Get next order when add new image
   */
  getNextOrder() {
    var order = 1;

    // If there is image in collection, add new image in the end of collection
    if (this.objects && this.objects.length)      order = this.objects.length + 1;

      // for (var i = 0; i < this.objects.length; i++) {
      //   if (order <= this.objects[i].post_order) {
      //     order = this.objects[i].post_order + 1;
      //   }
      // }
    return order;
  }
}
