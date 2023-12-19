/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 14 Aug 2022
 * @purpose For working with survey model and relationship between surveys
 */

import { BaseModel } from './base.model';
import { Configure } from './configure.model';

export class FeedbackModel extends BaseModel {
   
  device_id: string;
  rating: number;
  comment: string;
  device_type: number;
  grp_id: string;
  os: string;
  sur_id: string;
  contact: string;
  name: string;
  parent: string;
  notes: string;
  sur_path: string;
  body: string;
  cus_id: string;
  inv_id: string;
  ip_add: string;
  fb_path: string;
  target_id: string;
  device_date: Date;
  extension: string;
  severity: number;
  db_created: Date;

  // Extension fields - created for processing
  children: FeedbackModel[];   // Child surveys
  configures: Configure[];             // Survey configurations
  question_texts: any[];       // Store question in defferent languages
  description_texts: any[];    // Store description in defferent languages

  question_text_links: {};    // Link language code and question text
  description_text_links: {}; // Link language code and description text
 
  // static create_fields = ['status'];
  static update_fields = ['id', 'status', 'notes'];
  
  /**
  * Survey Constructor
  */
//    constructor( raw_data ) {
//      super(raw_data);
//    }

  static FEEDBACK_STATUS_LIST = {
    NEW: 0,
    PROCESSING: 1,
    PROCESSED: 2,
    INVALID: 3,
    UNFINISHED: 4
  }

  /**
   * Init data for this model
  */
  initData() {
  }

}

