import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { Collection, GaugeChartOptions } from '@app/_models';

@Component({
  selector: 'survey-flx-report',
  templateUrl: 'survey.flx.component.html'
})
export class SurveyFLXReport extends BaseReport {
  RATING_COLORS = {
    1: '#A82921', 
    2: '#C13828', 
    3: '#E94C36', 
    4: '#F49D3F', 
    5: '#F4B543',
    6: '#FACB48',
    7: '#FBD96E',
    8: '#FDE168',
    9: '#D0E26D',
    10: '#5FCE6D',
    11: '#50B05F',
  }
  statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  flxGaugeChartOptions = {
    min: 1,
    max: 100,
    redFrom: 1,
    redTo: 2,
    yellowFrom: 2,
    yellowTo: 3,
    greenFrom: 3,
    greenTo: 5,
    majorTicks: [],
    minorTicks: 2
  };

  constructor (public injector: Injector) {
    super(injector);
    
    this.initHMChartOptions();
  }

  /**
   * Make chart options
  */
  postProcessing(report_data) {

    // Set options for Gauge chart
    let report_survey = this.filter_data.childSurvey || this.filter_data.mainSurvey;
    let scales = report_survey.scales;
    let red_max = Math.round(scales/3);
    let yellow_max = Math.round(2*scales/3);

    let marks = [];
    for (let i=1; i<=scales; i++) {
      marks.push(String(i));
    }

    this.flxGaugeChartOptions = {
      min: 1,
      max: scales,
      redFrom: 1,
      redTo: red_max,
      yellowFrom: red_max,
      yellowTo: yellow_max,
      greenFrom: red_max,
      greenTo: scales,
      majorTicks: marks,
      minorTicks: 5
    };
  
    // console.log("Options: ", this.lineChartOptions);
  }

  /**
   * Convert API output data on ratings to chart data
   * @input rating_data: Array[{count: 63, proportion: 8.47, rating: 1}]
   * @outpt {labels: ['Satisfied', 'Very Satisfied'], data: [3, 6] }
  */
  getFeedbackCountRating(rating_data) {
    // Get collection information to get name for each rating level
    let report_survey = this.filter_data.childSurvey || this.filter_data.mainSurvey;
    let col_id = report_survey.col_id;

    const url =  this.app_service.Based_URLs.main + Collection.uri_posts;
    let data = { id: col_id, status: 0};
    this.app_service.getAPI_Observable(url, data).subscribe(
      function(posts) {
        // console.log("Collection posts: ", posts);
        let res = { 
          labels: [], 
          data: []
        }

        let chart_data = [];
        let chart_color = [];
    
        for (let item of rating_data) {
          let label = item.rating;
          if (posts && (item.rating <= posts.length))
            label = posts[<number>item.rating - 1].content;
          res.labels.push(label);

          chart_data.push(item.count);
          let corlor_index = Math.floor(item.rating * 11 / report_survey.scales);
          chart_color.push(this.RATING_COLORS[corlor_index]);
        }
        res.data = [{
          data: chart_data,
          backgroundColor: chart_color
        }]
        this.rating_data = res;
      }.bind(this)
    );
    return;
  }
}