import {Component, Injector, Input, ViewChild} from '@angular/core';
import {hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';

import { URIS, Utils } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { ChartData, SurveyModel } from '@app/_models';
import { ChartDataSets } from 'chart.js';
import { BaseChartComponent } from '@app/_bases/basechart.component';

@Component({
  selector: 'survey-multi_select-report',
  templateUrl: 'survey.multi_selection.component.html'
})
export class SurveyMultiSelectionReport extends BaseReport {

  statistics_url = this.app_service.Based_URLs.front + URIS.front.count_factor_feedback;
  factor_statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  constructor (public injector: Injector) {
    super(injector);
    
    this.initHMChartOptions();
  }

  /**
   * Process data to insert into chart
  */
   dataProcesssing(reportData) {
    // console.log("Report data: ", reportData);
    if (!reportData)      return;

    this.factor_data = this.report_survey.subs;
    this.rating_data = this.getFeedbackCount_ForFactors(reportData);
  }

  /**
   * Convert API output data to dictionary of factor id and selection count 
   * @input { factor_counts: Array[{count: 63, sur_id: "45fa99a10b299ae3c771e8e1f500585b"},...], feedbackcount: 744}
   * @outpt { 'factor_1_id': count_1 , 'factor_2_id': count_2 }
  */
  // convertFactorCount_2_dictionary(reportData) {
  //   return this.convertScoreData_toMap(reportData.factor_counts, "count", "sur_id");
  // }

  /**
   * Convert API output data on ratings to chart data, and factor list
   * @input { factor_counts: Array[{count: 63, sur_id: "45fa99a10b299ae3c771e8e1f500585b"},...], feedbackcount: 744}
   * @outpt { labels: ['factor_1_name', 'factor_2_name'], data: [32, 63] }
  */
  getFeedbackCount_ForFactors(reportData) {
    if (!this.report_survey.subs.length)    return;
    
    let factor_rating = this.convertScoreData_toMap(reportData.factor_counts, "count", "sur_id");
    // console.log("Factor rating: ", factor_rating );

    let datasets: ChartDataSets[] = [];
    const total_feedback_count = reportData.feedbackcount;
    for (let idx in this.report_survey.subs) {
      const factor = this.report_survey.subs[idx];

      let feedback_count = factor_rating[factor.id];
      if (feedback_count) {
        const factor_color = BaseChartComponent.CHART_COLORS[idx];

        let factor_dataset: ChartDataSets = {
          data: [Math.round(((feedback_count/total_feedback_count)*10000))/100],
          label: factor.question,
          backgroundColor: hexToRgba(factor_color, 90),
          borderColor: factor_color,
          pointHoverBackgroundColor: '#fff'
        }
        datasets.push(factor_dataset);
      } else {
        feedback_count = 0
      }
      factor["count"] = feedback_count;
    }
    
    // console.log("Factor rating proportions: ", datasets);
    return datasets;
  }

  /**
   * Make report on factor selection by time
  */
  factor_Click(event, factor, factor_index) {
    // console.log("Element checked: ", event.srcElement.checked);
    // console.log("Request for factor:", factor);
    // console.log("Factor index: ", factor_index);
    let checked = true;

    if (event.srcElement.type == "checkbox") {
      checked = event.srcElement.checked;
    } else {
      let elem = <any>document.getElementById(factor.id);
      if (!elem)    return;
      elem.checked = !elem.checked;
      checked = elem.checked;
    }

    if (checked) {
      // Add index to factor then load statistics
      factor["factor_index"] = factor_index;
      this.loadFactor_statistic(factor);

    } else {
      // Remove factor statistics
      const report_index = factor["report_index"];
      this.count_by_time_datasets.splice(report_index, 1);
    }

  }

  /**
   * Extract feedback count by time to chart datasets
  */
  factorDataProcesssing(report_data, factor: SurveyModel) {
    if (!report_data.count_bytimes || !report_data.count_bytimes.length)  return;

    let count_map = this.convertScoreData_toMap(report_data.count_bytimes, "count");
    if (!this.time_labels || !this.time_labels.length)    return;

    const factor_color = BaseChartComponent.CHART_COLORS[factor["factor_index"]];
    const factor_Set: ChartDataSets = {
      data: [],
      label: factor.question,
      backgroundColor: hexToRgba(factor_color, 10),
      borderColor: factor_color,
      pointHoverBackgroundColor: '#fff'
    };
    
    for (const label of this.time_labels) {
      if (count_map[label])
        factor_Set.data.push(count_map[label])
      else
        factor_Set.data.push(0)
    }
    this.count_by_time_datasets.push(factor_Set);
    // console.log("Labels: ", this.time_labels);
    // console.log("Dataset: ", this.count_by_time_datasets);

    // Setting factor management information
    factor["report_index"] = this.count_by_time_datasets.length - 1;
  }

}