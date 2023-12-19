import { Component, Injector, ViewChild } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { TablePageComponent } from '@app/_bases';
import { ReportFilter, SurveyModel, SurveyFactory, Survey, Device } from '@app/_models';
import { Plugin, PluginModel, Label } from '@app/_models';
import { FeedbackFactory, FeedbackMessage } from '@app/_models/feedback.object';
import { URIS, Utils } from '@app/_services';

import { ModalDirective } from 'ngx-bootstrap/modal';
import * as XLSX from 'xlsx';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 02 Nov 2022
 * @purpose for listing feedbacks
 */
@Component({
  templateUrl: 'feedback.component.html',
  styleUrls: ['feedback.component.css']
})
export class FeedbackComponent extends TablePageComponent {
  @ViewChild('feedbackInfotDialog') information_Dialog: ModalDirective;

  FEEDBACK_STATUS_LIST = [0, 1, 2, 3, 4];

  object_type = FeedbackMessage;
  
  private email_address: string;
  private feedback_device: any;
  private feedback_group: any;
  // public device_list: [] = [];

  SEARCH_TIME = [
    {key: 0, name: 'REPORT.CB_BY_DAY', lstValue: []},
    {key: 1, name: 'REPORT.CB_BY_MONTH', lstValue: []},
    {key: 2, name: 'REPORT.CB_CUSTOM', lstValue: []},
  ];

  /**
   * selected filters in form
  */
  form_filter: ReportFilter = new ReportFilter();
  active_survey: any;     // Store survey for listing feedbacks
  export_survey: any;     // Store exporting survey
  exportItems: [];
  exported2Excel = false;

  // Plugin to display action button in feedback detail
  feedback_plugins: Plugin[] = [];

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * @return URL for getting object list
  */
  public getListingURL() {
    return this.app_service.Based_URLs.front + this.object_type.uri_list;
  }

  /**
   * Change main survey
   * */ 
  mainSurveyChange(survey: SurveyModel) {
    if (!survey)    return;

    this.form_filter.mainSurvey = survey;

    // get Groups
    this.getGrouplist(this.form_filter.mainSurvey.id);

    // get Devices
    // this.getDevicelist();
  }

  groupChange(group) {
    if (group && group.id)
      this.form_filter.group_id = group.id;
    else
      this.form_filter.group_id = null;

    this.getDevicelist(this.form_filter.group_id);
  }

  deviceChange(device) {
    // console.log("Selected device: ", this.form_filter.device);
    if (device)
      this.form_filter.device_id = device.id;
    else
      this.form_filter.device_id = null;
  }

  /**
   * Make filtering parameter for feedback list
   */
  searchPrams() {
    if (this.form_filter.mainSurvey) {
      this.params["sur_id"] = this.form_filter.mainSurvey.id;
    }

    if (this.form_filter.status != null && this.form_filter.status != undefined) {
      this.params["status"] = this.form_filter.status;
    }

    if (this.form_filter.group_id) {
      this.params["grp_id"] = this.form_filter.group_id;
    }

    if (this.form_filter.device_id) {
      this.params["device_id"] = this.form_filter.device_id;
    }

    this.params["time_unit"] = this.form_filter.time.time_unit;

    if (this.form_filter.time.time_unit == 2) {
      // For range of time 
      const format = "YYYY-MM-DD";
      this.params["start_time"] = this.form_filter.time.time_range.start.format(format);
      this.params["end_time"] = this.form_filter.time.time_range.end.format(format);
    } else {
      this.params["bias"] = this.form_filter.time.bias;
    }
  }

  loadMainPageObjects() {}

  /**
   * Load all supportive data, such as some list displayed in form
   */
  loadSupportiveData() {
    // Make search time data
    for (let i = 1; i <= 90; i++) {
      var item = { value: i, name: 'REPORT.LB_DAY' };
      this.SEARCH_TIME[0].lstValue.push(item);
    }
    for (let i = 1; i <= 12; i++) {
      var item = { value: i, name: 'REPORT.LB_MONTH' };
      this.SEARCH_TIME[1].lstValue.push(item);
    }

    // Get device list
    this.getDevicelist(this.form_filter.group_id);

    // Get Plugin list
    let plugin_list_filter = {
      "type": 0, "status": 0
    };
    this.loadObjectsbyFilter(Plugin, plugin_list_filter).subscribe(
      function(data) {
        this.feedback_plugins = data;
      }.bind(this)
    );
  }

  /**
   * Method to call analysis component
   * - make filter condition
   * - assign to analysis component
   * */ 
  getFeedbackList() {
    if (!this.form_filter.mainSurvey)    return;
    // console.log("Filter data: ", this.form_filter);    

    // get information on selected survey tree         
    let selectedSurvey = new Survey(this.injector, {id: this.form_filter.mainSurvey.id});
    selectedSurvey.getSurveyTree().then(
      function(survey_tree) {
        // console.log("Survey tree: ", survey_tree);        
        this.active_survey = SurveyFactory.createSurvey( this.injector, survey_tree);
        this.active_survey.makeShortHeader();
        // console.log("Survey cols: ", this.active_survey.headerCols);

        this.search();
      }.bind(this)
    );
  } 

  /**
   * Processing object data: convert feedback tree to data table on feedback list
  */
  objectData_processing(feedback_lists) { 
      if (!feedback_lists || !feedback_lists.length)    return null;

      let messages = [];
      for (let i=0; i<feedback_lists.length; i++) {
          let message = FeedbackFactory.createMessage(this.injector, feedback_lists[i], this.active_survey);
          message.makeShortReportData();
          messages.push(message);
      }

    return messages; 
  }

  /**
   * Search group in list by group id
  */
  searchGroupById(id, group_list) {
    if (!id || !group_list || !group_list.length)   return null;

    for (let group of group_list) {
      if (group.id==id)   return group; 
    }

    return  null;
  }

  /**
   * Goto feedback detail page
  */
  feedbackDetail(message: FeedbackMessage) {
    message["serializedMSGs"] = message.feedbackMessageList();
    this.object = message;
    this.information_Dialog.show()
    // console.log("Messages for displaying: ", this.object["serializedMSGs"]);
    // console.log("Displaying message: ", this.object);

    // Get feedback device 
    this.getObjectInfoById(Device, null, {device_id: message.data.device_id})
      .then( function(device) {
        this.feedback_device = device;
      }.bind(this)
    );

    // Get feedback_group
    this.feedback_group = this.searchGroupById(message.data.grp_id, this.group_list);
  }

  /**
   * Send email on feedback content
  */
  sendEmail() {
    if (!this.email_address || !this.email_address.length)    return;

    let feedback_content = document.getElementsByTagName("feedback-content")[0];
    let content = `
    <!DOCTYPE html>
    <html>
        <body>%s</body>
    </html>`.replace("%s", feedback_content.innerHTML);
    // console.log("Feedback content in html: ", content);

    let payload = {
      email: this.email_address,
      feedback: this.object.data,
      feedback_detail: content,
      feedback_id: this.object.data.id
    }
    let url = this.app_service.Based_URLs.main + URIS.main.send_email;
    this.app_service.postAPI(url, payload, function(res) {
        this.app_service.showMessageById("MSG.SEND_EMAIL_SUCCESS", 'toast-success');
      }.bind(this)
    );
  }

  /**
   * Send feedback data to URL in plugin
   * payload: { feedback: feedback_json, readable: feedback_html_content}
   * */ 
  callPlugin(plugin_index) {
    let feedback_html_content = document.getElementsByTagName("feedback-content")[0];
    let payload = {
      feedback: this.object.data,
      readable: feedback_html_content.innerHTML
    }
    let url = this.feedback_plugins[plugin_index]["url"];

    this.app_service.postAPI(url, payload);
  }

  /**
   * Export feedback list to excel file
   * */ 
  exportFeedbacks() {
    if (!this.form_filter.mainSurvey)    return;
    // console.log("Filter data: ", this.form_filter);    

    // get information on selected survey tree         
    let selectedSurvey = new Survey(this.injector, {id: this.form_filter.mainSurvey.id});
    selectedSurvey.getSurveyTree().then(
      function(survey_tree) {
        // console.log("Survey tree: ", survey_tree);
        this.export_survey = SurveyFactory.createSurvey( this.injector, survey_tree);
        this.export_survey.makeFullSurveyReport();        
        // console.log("Survey cols: ", this.active_survey.headerCols);

        this.exportItems = [];
        // this.getAllFeedbacks();
        this.exported2Excel = false;
        this.getAllExportingFeedbacks();
      }.bind(this)
    );
  }

  /**
   * Get all feedbacks - filter by filter form for exporting
  */
  getAllExportingFeedbacks() {
    let url = this.getListingURL();

    let payload = {};
    if (this.form_filter.mainSurvey) {
      payload["sur_id"] = this.form_filter.mainSurvey.id;
    }

    if (this.form_filter.status != null && this.form_filter.status != undefined) {
      payload["status"] = this.form_filter.status;
    }

    if (this.form_filter.group_id) {
      this.params["grp_id"] = this.form_filter.group_id;
    }

    if (this.form_filter.device_id) {
      this.params["device_id"] = this.form_filter.device_id;
    }

    payload["time_unit"] = this.form_filter.time.time_unit;
    payload["bias"] = this.form_filter.time.bias;

    this.app_service.postAPI(url, payload, function(items) {
        if (!items || !items.length)    return;

        let exportItems = [];
        for (var i=0; i<items.length; i++) {
          let message = FeedbackFactory.createMessage(this.injector, items[i], this.export_survey);
          message.makeFullReportData();
          
          // Get device name
          if (this.device_list && this.device_list.length) {
              let found = Utils.findObjectByKey(this.device_list, "id", items[i].device_id);
              if (found>=0)   message['device_name'] = this.device_list[found].name;
          }

          // // Get group name
          if (this.group_list && this.group_list.length) {
              let found = Utils.findObjectByKey(this.group_list, "id", items[i].grp_id);
              if (found>=0)   message['group_name'] = this.group_list[found].name;
          }
  
          exportItems.push(message);
        }
        this.exportItems = exportItems;
      }.bind(this)
    );
  }

  /**
   * Save data from table in page into localfile
   * Get table data in exported table
   * Save to local file - based on platform
   * */ 
  saveData2Excel(last_index: number) {
    if (this.exported2Excel)  return;
    let file_name = "feedback_list." + this.form_filter.mainSurvey.id + "_" + Date.now() + ".xlsx";
    // console.log("Start exporting to excel file: ", index);
    let element = document.getElementById('feedback2Export');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Feedback data');
 
    /** Save File in mobile platform*/ 
    const excelBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'base64'
    });
    this.saveMobileFile(file_name, excelBuffer);
    this.exported2Excel = true;
  }

  /**
   * Save file to mobile device
   * @input filename File name for saving
   * @input base64Data File data encoded in base64 method
   * */ 
  async saveMobileFile(fileName: string, base64Data: string) {
    try {
      await Filesystem.writeFile({
        path: `/${fileName}`,
        data: base64Data,
        directory: Directory.Documents,
      });
      this.app_service.showMessageById("MSG.EXPORT_FEEDBACK_SUCCESS");
      
    } catch (err) {
      console.log(err);
    }
  }
}

