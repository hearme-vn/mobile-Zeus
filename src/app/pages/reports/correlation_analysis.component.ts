import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/_bases';
import {CorrelationFilter, CorrelationForm, ReportFilter, Survey, SurveyModel, TimeFilter} from '@app/_models';
import * as dayjs from 'dayjs';
// import { TreeviewConfig, TreeviewItem } from '@ngx-treeview';
// import { Survey } from '@app/_models';

@Component({
  templateUrl: 'correlation_analysis.component.html',
  styleUrls: ['correlation_analysis.component.css']
})
export class RelationAnalysisComponent extends BaseComponent {
  constructor (public injector: Injector) {
    super(injector);
  }

  SEARCH_TIME = [
    {key: 0, name: 'REPORT.CB_BY_DAY', lstValue: []},
    {key: 1, name: 'REPORT.CB_BY_MONTH', lstValue: []},
  ];
  form_filter: ReportFilter = new ReportFilter();

  /**
   * filter structure for report
  */
  cor_filterData: CorrelationForm;

  // surveys: [];
  main_survey_filter = [0, 1, 2, 5, 8, 10, 11];
  index_survey_filter = [0, 1, 2, 10];
  factor_survey_filter = [4, 5, 6];

  selectedSurvey = null;
  survey_tree = null;     // Tree from API
  index_survey_tree = null;     // tree items for UI component
  factor_survey_tree = null;    // tree items for UI component

  // child_surveys = null;
  indexSurvey: SurveyModel = null;
  factorSurvey: SurveyModel = null;
  
  // config = TreeviewConfig.create({
  //   hasAllCheckBox: true,
  //   hasFilter: true,
  //   hasCollapseExpand: true,
  //   decoupleChildFromParent: false,
  //   maxHeight: 400
  // });
  config = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400,
    allow_root_survey: true
  };

  /**
   * Modify month bias to 6 month
  */
  timeUnitChange(time_filter: TimeFilter) {
    if (time_filter.time_unit != 2) {
      let DEFAULT_BIAS = {
        0: 30,    // For bias by days
        1: 6      // For month bias
      };
      time_filter.bias = DEFAULT_BIAS[time_filter.time_unit];
    } else {
      time_filter.time_range = {start: dayjs().subtract(1, 'month'), end: dayjs()};
    }
  }

  /** Load init data */
  loadMainPageObjects(): void {
    // load search time
    for (let i = 30; i <= 90; i++) {
      var item = { value: i, name: 'REPORT.LB_DAY' };
      this.SEARCH_TIME[0].lstValue.push(item);
    }
    for (let i = 6; i <= 12; i++) {
      var item = { value: i, name: 'REPORT.LB_MONTH' };
      this.SEARCH_TIME[1].lstValue.push(item);
    }
  }

  /**
   * hanlde event on change main survey selection
  */
  mainSurveyChange($event) {
    // console.log("Main survey for analysis: ", $event);
    // console.log("selected survey model: ", this.selectedSurvey);
    this.selectedSurvey = $event;
    this.indexSurvey = null;
    this.factorSurvey = null;
  }

  /**
   * Change index survey in survey tree
  */
  onIndexSurveyChange($event) {
    this.indexSurvey = $event
    // console.log("Index Survey: ", this.indexSurvey);
    // console.log("Factor Survey: ", this.factorSurvey);
  }

  /**
   * Change factor survey in survey tree
  */
  onFactorSurveyChange($event) {
    this.factorSurvey = $event;
    // console.log("Index Survey: ", this.indexSurvey);
    // console.log("Factor Survey: ", this.factorSurvey);
  }

  analysis() {
    if (!this.indexSurvey || !this.factorSurvey)    return;

    let filter = {
      index_survey: this.indexSurvey,
      index_sur_id: this.indexSurvey.id,
      index_sur_path: this.indexSurvey.sur_path,
      index_sur_type: this.indexSurvey.type,

      factor_survey: this.factorSurvey,
      factor_survey_id: this.factorSurvey.id,
      factor_survey_path: this.factorSurvey.sur_path,
      factor_survey_type: this.factorSurvey.type,
      default_factor_score: 0,
      time_unit: this.form_filter.time.time_unit,
      bias: this.form_filter.time.bias
    }

    // console.log("Correlation filter: ", filter);
    this.cor_filterData = new CorrelationForm(filter);
    // this.cor_filterData = new CorrelationForm(filter2);
  }
}
