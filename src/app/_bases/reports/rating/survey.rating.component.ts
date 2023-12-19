import {Component, Injector, Input, ViewChild} from '@angular/core';
import {hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';

import { URIS, Utils } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { ChartData, SurveyModel } from '@app/_models';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartComponent } from '@app/_bases/basechart.component';

@Component({
  selector: 'survey-rating-report',
  templateUrl: 'survey.rating.component.html'
})
export class Survey5StarReport extends BaseReport {

  statistics_url = this.app_service.Based_URLs.front + URIS.front.count_factor_feedback;
  factor_statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  rating_data: ChartDataSets[] = [];    // chart data for 5 star rating for factors - all rating level 
  rating_score: ChartDataSets[] = [];    // chart data for rating score for factors - fibal score
  star_rating_labels = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    legend: {
      display: false
    },
    plugins: {
      labels: {
        display: false,
        render: 'value',
        precision: 0
      }
    }    
  };

  constructor (public injector: Injector) {
    super(injector);
    
    this.initHMChartOptions();

    for (let i=1; i<6; i++) {
      const rating_level_name = this.translate.instant("5STARS." + i);
      this.star_rating_labels.push(rating_level_name);
    }
  }


  /**
   * Reset chart data
   * */ 
  resetChartData () {
    super.resetChartData();

    this.rating_data = [];
    this.rating_score = [];
  }

  /**
   * Process data to insert into chart
  */
   dataProcesssing(reportData) {
    this.resetChartData();

    // console.log("Report data: ", reportData);
    if (!reportData)      return;

    this.factor_data = this.report_survey.subs;
    this.getFeedbackCount_ForFactors(reportData);
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

    for (let idx in this.report_survey.subs) {
      const factor = this.report_survey.subs[idx];

      let feedback_count = factor_rating[factor.id];
      if (!feedback_count)      feedback_count = 0
      factor["count"] = feedback_count;
    }
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
      this.score_by_time_datasets.splice(report_index, 1);
      this.rating_score.splice(report_index, 1);
      this.rating_data.splice(report_index, 1);
    }

    return false;
  }

  /**
   * Extract feedback count by time to chart datasets
  */
  factorDataProcesssing(report_data, factor: SurveyModel) {
    const factor_count_by_time = this.getFactorCountBytime(report_data.count_bytimes, factor);
    this.count_by_time_datasets.push(factor_count_by_time);

    const factor_score_by_time = this.getFactorScoreBytime(report_data.score_bytimes, factor);
    this.score_by_time_datasets.push(factor_score_by_time);

    const factor_score_data = this.getFactorScore(report_data.score, factor);
    this.rating_score.push(factor_score_data);

    const factor_rating_data = this.getFactor_starsRating(report_data.ratings, factor);
    this.rating_data.push(factor_rating_data);

    // Setting factor management information
    factor["report_index"] = this.count_by_time_datasets.length - 1;
  }

  /**
   * Get factor count by time ChartDataset
  */
  getFactorCountBytime(count_bytimes, factor: SurveyModel) {

    let count_map = this.convertScoreData_toMap(count_bytimes, "count");
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
    return factor_Set;
  }

  /**
   * Get factor count by time ChartDataset
  */
   getFactorScoreBytime(score_bytimes, factor: SurveyModel) {
    let count_map = this.convertScoreData_toMap(score_bytimes, "score");
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
    return factor_Set;
  }

  /**
   * Get factor final score 
  */
  getFactorScore(score, factor: SurveyModel) {
    const factor_color = BaseChartComponent.CHART_COLORS[factor["factor_index"]];
    let factor_dataset: ChartDataSets = {
      barPercentage: 0.2,      
      data: [score],
      label: factor.question,
      backgroundColor: hexToRgba(factor_color, 90),
      borderColor: factor_color,
      pointHoverBackgroundColor: '#fff'
    }
    
    // console.log("Factor rating proportions: ", datasets);
    return factor_dataset;

  }

  /**
   * Get factor final score
   * @input is array of rating [{count: 1, proportion: 5.26, rating: 2}, {count: 9, proportion: 47.37, rating: 3}, ...]
  */
  getFactor_starsRating(ratings: [any], factor: SurveyModel) {
    let factor_rating = [0, 0, 0, 0, 0];
    if (!ratings || !ratings.length)  return null;
    for (let rating of ratings) {
      const level = rating.rating;
      factor_rating[level-1] = rating.count;
    }

    const factor_color = BaseChartComponent.CHART_COLORS[factor["factor_index"]];
    let factor_dataset: ChartDataSets = {
      data: factor_rating,
      label: factor.question,
      backgroundColor: hexToRgba(factor_color, 90),
      borderColor: factor_color,
      pointHoverBackgroundColor: '#fff'
    }
    
    // console.log("Factor rating proportions: ", datasets);
    return factor_dataset;

  }

}