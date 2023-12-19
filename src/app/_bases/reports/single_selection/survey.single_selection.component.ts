import {Component, Injector, Input, ViewChild} from '@angular/core';
import {hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';

import { URIS, Utils } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { SurveyModel } from '@app/_models';
import { ChartDataSets } from 'chart.js';
import { BaseChartComponent } from '@app/_bases/basechart.component';

@Component({
  selector: 'survey-single_select-report',
  templateUrl: 'survey.single_selection.component.html'
})
export class SurveySingleSelectionReport extends BaseReport {

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

    this.rating_data = this.getFeedbackCount_ForFactors(reportData);

    // Init data for countung factor selection by time report
    // this.count_by_time = { 
    //   labels: this.time_labels, 
    //   datasets: []
    // }
  }

  /**
   * Convert API output data to dictionary of factor id and selection count 
   * @input { factor_counts: Array[{count: 63, sur_id: "45fa99a10b299ae3c771e8e1f500585b"},...], feedbackcount: 744}
   * @outpt { 'factor_1_id': count_1 , 'factor_2_id': count_2 }
  */
  // convertFactorCount_2_dictionary(reportData) {
  //   let res = {};
  //   if (reportData && reportData.factor_counts && reportData.factor_counts) {
  //     for (let item of reportData.factor_counts) {
  //       res[item.sur_id] = item.count;
  //     }
  //   }
  //   return res;
  // }


  /**
   * Convert API output data on ratings to chart data, and factor list
   * @input { factor_counts: Array[{count: 63, sur_id: "45fa99a10b299ae3c771e8e1f500585b"},...], feedbackcount: 744}
   * @outpt { labels: ['factor_1_name', 'factor_2_name'], data: [32, 63] }
  */
  getFeedbackCount_ForFactors(reportData) {
    // let factor_rating = this.convertFactorCount_2_dictionary(reportData);
    let factor_rating = this.convertScoreData_toMap(reportData.factor_counts, "count", "sur_id");
    // console.log("Factor rating: ", factor_rating );

    this.factor_data = this.report_survey.subs;
    // console.log("Factor rating: ", factor_rating );

    let labels = [];
    let data = [];

    for (let item of this.factor_data) {
      let count = factor_rating[item.id];
      let label = Utils.string_trim(item.question, BaseReport.LABEL_LENGTH_MAX, true);
      labels.push(label);
      data.push(count);
      item["count"] = count;
    }
    return {
      labels: labels,
      data: data
    };
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
    let count_map = this.convertScoreData_toMap(report_data.count_bytimes, "count");
    if (!this.time_labels || !this.time_labels.length)    return;

    const factor_color = BaseChartComponent.CHART_COLORS[factor["factor_index"]];
    const factor_Set: ChartDataSets = {
      data: [],
      label: factor.question,
      //label: Utils.string_trim(factor.question, BaseReport.LABEL_LENGTH_MAX, true)
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