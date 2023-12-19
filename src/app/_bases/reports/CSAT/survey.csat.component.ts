import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
// import { GaugeChartOptions } from '@app/_models';

@Component({
  selector: 'survey-csat-report',
  templateUrl: 'survey.csat.component.html'
})
export class SurveyCSATReport extends BaseReport {

  RATING_COLORS = {
    1: '#EE5935', 
    2: '#F2914B', 
    3: '#F9C947', 
    4: '#A7D43D', 
    5: '#5ABF30'
  }
  statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  csatGaugeChartOptions = {
    // width: 400,
    // height: 120,
    redFrom: 0,
    redTo: 25,
    yellowFrom: 25,
    yellowTo: 75,
    greenFrom: 75,
    greenTo: 100,
    majorTicks: ["0", "25", "50", "75", "100"],
    minorTicks: 5
  };

  constructor (public injector: Injector) {
    super(injector);
    
    this.initHMChartOptions();
  }


  /**
   * Convert API output data on ratings to chart data
   * @input rating_data: Array[{count: 63, proportion: 8.47, rating: 1}]
   * @outpt {labels: ['Satisfied', 'Very Satisfied'], data: [3, 6] }
  */
  getFeedbackCountRating(rating_data) {
    let res = { 
      labels: [], 
      data: []
    }
    let chart_data = [];
    let chart_color = [];

    for (let item of rating_data) {
      let label = this.translate.instant("CSAT." + item.rating);
      res.labels.push(label);
      chart_data.push(item.count);
      chart_color.push(this.RATING_COLORS[item.rating]);
    }
    res.data = [{
      data: chart_data,
      backgroundColor: chart_color
    }]
    return res;
  }

}