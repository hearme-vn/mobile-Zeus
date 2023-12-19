import { Injector, Component } from '@angular/core';

import { environment }  from '@env/environment';

import { TablePageComponent } from './tablepage.component';
import { APPService, URIS, APPCONSTS, Utils } from '@app/_services';


/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date Jun 3, 2020
 * @purpose Base CS component, will be extended by CS page components
 * This provide common method for customer services
 */
class BaseCSComponent extends TablePageComponent {
  /**
   * - Invitation list keep all customer information and device pair.
   * - Stored in local storage
   * */ 
  public invitation_list = [];
  private wait_time = environment.customer_wait_fb * 1000;
  
  public status_checker_schedule: any;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /**
   * This method is to invite customer to send feedback on kiosk device
  */
  inviteSendingFeedback(device, customer) {
    // console.log("Customer: %s, device: %s", device, customer);

    if (!device || !customer)    return;
    let payload = {
      device_id: device["id"],
      customer: customer
    }
    let customer_syn_url = this.app_service.Based_URLs.main + URIS.main.synchronize_customer;
    this.app_service.postAPI(customer_syn_url, payload, function(res) {
      // console.log("return devices:", res);
      let invitation = {
        device: device,
        customer: customer,
        created: new Date(),
        status: APPCONSTS.INVITATION_STATUS_SENT
      };
      this.insertInvitation(invitation);
      // this.cancelable_checking();
      Utils.setLocalStorage(APPCONSTS.LOCAL_STORAGE_KEYS.INVITATION_LIST_KEY, this.invitation_list);

    }.bind(this));
  }


  /**
   * Check and insert new invitation into list
   * - Invitation list keep all customer information and device pair.
   * - Stored in local storage
   * */ 
  insertInvitation(invitation) {
    // Pruning list, to keep limit
    if (this.invitation_list.length == APPCONSTS.INVITATION_LIST_LIMIT) {
      this.invitation_list.pop();
    }
    this.invitation_list.unshift(invitation);
  }

}

export {  BaseCSComponent };