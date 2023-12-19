import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Target} from '@app/_models/target.model';
import {URIS} from '@app/_services';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Collection, CollectionModel} from '@app/_models';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing target
 */
@Component({
  templateUrl: 'target.component.html',
  styleUrls: ['target.component.css']
})
export class TargetComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;
  @ViewChild('orgFaceDialog') orgFaceDialog;

  object_type = Target;
  /** Structure of filtering form fields */
  filtering_form = {
    name: null,
    status: -1
  };

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Set params for search data */
  searchPrams() {
    // console.log('Filtering form values are: ', this.filtering_form);
    if (this.filtering_form.name) {
      this.params['name'] = this.filtering_form.name;
    } else {
      delete this.params['name'];
    }
    if (this.filtering_form.status != -1) {
      this.params['status'] = this.filtering_form.status;
    } else {
      delete this.params['status'];
    }
  }

  /**
   * Open select face dialog
   */
  openCollection() {
    this.orgFaceDialog.show();
  }
  /**
   * Set selected face to data
   * @param fileName
   */
  setFace(fileName) {
    this.object.data.face = fileName;
    this.orgFaceDialog.hide();
  }

}
