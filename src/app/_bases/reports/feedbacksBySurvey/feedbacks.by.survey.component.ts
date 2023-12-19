import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { HMChartOptions, Survey } from '@app/_models';

@Component({
  selector: 'feedbackcount-bysurvey-report',
  template: `
      <hm-piechart #feedbacks_bysurvey 
        [style] = "styleData"
        [data]="chartData"
        [labels]="chartLabels"
        [hm_options]="hmoptions">
      </hm-piechart>
  `
})
export class FeedbacksBySurvey extends BaseReport {
  hmoptions_feedbackcount: any;

  statistics_url = this.app_service.Based_URLs.front + URIS.front.fbcount_count_by_surveys;

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * Get all surveys in system
  */
  loadObjectList() {
    let filterParams = { status: 100 };
    return this.loadObjectsbyFilter(Survey, filterParams);
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(reportData) {
    this.hmoptions = new HMChartOptions({"title_text": this.translate.instant('DASHBOARD.FEEDBACKS_BY_SURVEY_CHART_TITLE')});

    // console.log("Report data: ", reportData);
    this.resetChartData();

    if (!reportData || !reportData.length)      return;
    this.loadObjectList().subscribe(
      function(objects) {
        let chartData = [];
        let chartLabels = [];

        // console.log("Survey list", objects)
        //Mapping group with id
        let object_map = {}
        if (objects && objects.length) {
          for (let object of objects) {
            object_map[object.id] = object;
          }
        }

        // make report dataset
        for (let object_report of reportData) {
          // console.log("Group report data: ", group_report);
          // feedback count by survey
          chartData.push(object_report.count);

          // Survey name
          let object = object_map[object_report.sur_id];
          if (object)
            chartLabels.push(object.name)
          else
            chartLabels.push(object_report.sur_id);
        }  
        this.chartData = chartData;
        this.chartLabels = chartLabels;
      }.bind(this)
    )
  }

}

