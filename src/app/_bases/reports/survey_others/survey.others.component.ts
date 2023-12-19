import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { Survey } from '@app/_models';

@Component({
  selector: 'survey-other-report',
  templateUrl: 'survey.others.component.html'
})
export class SurveyOtherReport extends BaseReport {
  
  statistics_url = this.app_service.Based_URLs.front + URIS.front.statistics;

  constructor (public injector: Injector) {
    super(injector);
    
    this.initHMChartOptions();
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(statisticsData) {
    // console.log("Other Report data: ", statisticsData);
    this.resetChartData();
    if (!statisticsData)      return;

    this.count_by_time = this.getFeedbackCountByTime(statisticsData.count_bytimes);
    // let fb_count_title = this.translate.instant("REPORT.FBCOUNT_BY_TIME");
    // this.count_by_time.datasets[0].label = fb_count_title;

    this.initHMChartOptions();
  }

}

