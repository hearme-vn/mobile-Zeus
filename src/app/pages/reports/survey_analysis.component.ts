import { Component, Injector, ViewChild } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from '@ngx-treeview';

import { BaseComponent } from '@app/_bases';
import { ReportFilter, SurveyModel } from '@app/_models';
import { URIS } from '@app/_services';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 02 Nov 2022
 * @purpose for analizing surveys
 */
@Component({
  templateUrl: 'survey_analysis.component.html',
  styleUrls: ['survey_analysis.component.css']
})
export class SurveyAnalysisComponent extends BaseComponent {
  public device_list: [] = [];

  constructor (public injector: Injector) {
    super(injector);
  }

  SEARCH_TIME = [
    {key: 0, name: 'REPORT.CB_BY_DAY', lstValue: []},
    {key: 1, name: 'REPORT.CB_BY_MONTH', lstValue: []},
    {key: 2, name: 'REPORT.CB_CUSTOM', lstValue: []},
  ];

  /**
   * selected filters in form
  */
  form_filter: ReportFilter = new ReportFilter();
  report_filter: ReportFilter;
  child_surveys: [];

  /**
   * Change main survey
   * */ 
  mainSurveyChange(survey: SurveyModel) {
    if (!survey)    return;
    
    this.form_filter.mainSurvey = survey;
    this.form_filter.childSurvey = null;

    this.form_filter.sur_id = survey.id;
    this.form_filter.type = survey.type;
    this.form_filter.sur_path = null;

    // // console.log("Changed main survey");
    // // Get survey tree from main survey
    let url = this.app_service.Based_URLs.main + URIS.main.survey_tree;
    let payload = {
      id: this.form_filter.mainSurvey.id
    }
    this.app_service.postAPI(url, payload, 
      function(survey) {
        this.child_surveys = [];

        // console.log("Survey tree: ", res);
        if (survey && survey.children && survey.children.length) {
          for (let child of survey.children) {
            this.child_surveys.push(new TreeviewItem(child));
          }
        }
      }.bind(this)
    );

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
   * Load all supportive data, such as some list displayed in form
   */
  loadSupportiveData() {
    // load search time
    for (let i = 1; i <= 90; i++) {
      var item = { value: i, name: 'REPORT.LB_DAY' };
      this.SEARCH_TIME[0].lstValue.push(item);
    }
    for (let i = 1; i <= 12; i++) {
      var item = { value: i, name: 'REPORT.LB_MONTH' };
      this.SEARCH_TIME[1].lstValue.push(item);
    }

  }

  /**
   * Change selected survey
  */
  onSurveyChange(survey: SurveyModel) {
    if (survey) {
      // console.log("Change selected survey", $event);
      this.form_filter.childSurvey = survey;
      this.form_filter.sur_id = survey.id;
      this.form_filter.type = survey.type;
      this.form_filter.sur_path = survey.sur_path;
    } else {
      this.form_filter.childSurvey = null;
      this.form_filter.sur_id = this.form_filter.mainSurvey.id;
      this.form_filter.type = this.form_filter.mainSurvey.type;
      this.form_filter.sur_path = "";
    }
  }

  /**
   * Method to call analysis component
   * - make filter condition
   * - assign to analysis component
   * */ 
  analysis() {
    if (!this.form_filter.mainSurvey)    return;
    this.report_filter = new ReportFilter({
      time: this.form_filter.time,
      mainSurvey: this.form_filter.mainSurvey,
      childSurvey: this.form_filter.childSurvey,
      sur_id: this.form_filter.sur_id,
      type: this.form_filter.type,
      group_id: this.form_filter.group_id,
      device_id: this.form_filter.device_id,
      status: this.form_filter.status,
      sur_path: this.form_filter.sur_path
    });
  }
}

