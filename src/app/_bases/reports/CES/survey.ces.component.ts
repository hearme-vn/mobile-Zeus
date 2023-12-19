import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { GaugeChartOptions } from '@app/_models';

@Component({
  selector: 'survey-ces-report',
  templateUrl: 'survey.ces.component.html'
})
export class SurveyCESReport extends BaseReport {
  RATING_COLORS = {
    1: '#E53836', 
    2: '#EF6549', 
    3: '#F5A741', 
    4: '#F8C346', 
    5: '#E3C744',
    6: '#9DCE3A',
    7: '#51AF2B',
  }
  statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  cesGaugeChartOptions = {
    min: 1,
    max: 7,
    redFrom: 1,
    redTo: 3,
    yellowFrom: 3,
    yellowTo: 5,
    greenFrom: 5,
    greenTo: 7,
    majorTicks: ["1", "2", "3", "4", "5", "6", "7" ],
    minorTicks: 5
  }

  // gaugeChartOptions = <GaugeChartOptions>{
  //   min: 0,
  //   max: 6,
  //   append: "",
  //   markers: { 
  //     "0": { color: "#555", type: "line", size: 8, label: "1" }, 
  //     "1": { color: "#555", type: "line", size: 8, label: "2" }, 
  //     "2": { color: "#555", type: "line", size: 8, label: "3" }, 
  //     "3": { color: "#555", type: "line", size: 8, label: "4" }, 
  //     "4": { color: "#555", type: "line", size: 8, label: "5" }, 
  //     "5": { color: "#555", type: "line", size: 8, label: "6" }, 
  //     "6": { color: "#555", type: "line", size: 8, label: "7" }
  //   },
  //   thresholds: {
  //     "0": { color: "red", bgOpacity: .5 },
  //     "1": { color: "violet", bgOpacity: .5 },
  //     "2": { color: "orange", bgOpacity: .5 },
  //     "3": { color: "yellow", bgOpacity: .5 },
  //     "4": { color: "blue", bgOpacity: .5 },
  //     "5": { color: "green", bgOpacity: .5 }
  //   },
  //   size: 300,
  //   bias: -1
  // };

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
      let label = this.translate.instant("CES." + item.rating);
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