import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { APPService, AuthenticationService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';
import { Collection, CollectionModel } from '@app/_models';
import { Image } from '@app/_models/image.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing theme
 */
@Component({
  selector: 'select-image',
  templateUrl: 'select-image.component.html',
  styleUrls: ['select-image.component.css']
})
export class SelectImageComponent implements OnInit {
  @ViewChild('selectImageDialog') selectImageDialog;
  @Output('setImage') setImage = new EventEmitter<string>();

  collection_id = '';
  collections = [];
  images = [];

  public injector: Injector;
  public app_service: APPService;
  public authenticationService: AuthenticationService;
  public translate: TranslateService;

  constructor (injector: Injector) {
    this.injector = injector;

    // Store all dependency services
    this.app_service = injector.get(APPService);
    this.authenticationService = injector.get(AuthenticationService);
    this.translate = injector.get(TranslateService);

  }

  ngOnInit(): void {
    // Get collection list
    let col_list_filter = {
      "status": CollectionModel.STATUS_LIST.ACTIVE
    };
    let url = this.app_service.Based_URLs.main + Collection.uri_list;
    this.app_service.postAPI_Observable(url, col_list_filter).subscribe(
      function(data) {
        this.collections = data;
      }.bind(this)
    );
  }

  /**
   * Show/hide dialog
   */
  show() {
    this.selectImageDialog.show();
  }
  hide() {
    this.selectImageDialog.hide();
  }

  /**
   * Load face images list after change collection
   */
  changeCollection() {
    if (this.collection_id) {
      const url = this.app_service.Based_URLs.main + Image.uri_list;
      this.app_service.getAPIPromise(url, {id: this.collection_id}).then(
        function(res) {
          this.images = res;
        }.bind(this)
      );
    }
  }

  selectedImage(filename) {
    this.setImage.emit(filename);
    this.selectImageDialog.hide();
  }
}
