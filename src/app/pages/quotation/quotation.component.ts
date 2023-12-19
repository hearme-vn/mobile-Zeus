import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Quotation} from '@app/_models/quotation.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for managing quotation
 */
@Component({
  templateUrl: 'quotation.component.html',
  styleUrls: ['quotation.component.css']
})
export class QuotationComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Quotation;

  /** Structure of filtering form fields */
  filtering_form = {
    status: -1
  };

  /**
   * status: list of status for filtering object in form
   */
  status_list = [
    { name_key: 'APP.UI_STATUS_ACTIVE', value: 0 },
    { name_key: 'APP.UI_STATUS_CANCEL', value: 1 }
  ]

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Set params for search data */
  searchPrams() {
    if (this.filtering_form.status != -1) {
      this.params['status'] = this.filtering_form.status;
    } else {
      delete this.params['status'];
    }
  }

  /** Highlight active quotation */
  checkActiveQuotation(quota) {
    let check;
    if (quota.status==this.APPCONSTS.QUOTATION_STATUS_CANCEL) {
      check = false;
    } else {
      if (!quota.end_time || quota.end_time >= Date.now())
        check = true;
      else
        check = false;
    }
    return check ? 'active_quotation' : 'normal_quotation'
  }

}
