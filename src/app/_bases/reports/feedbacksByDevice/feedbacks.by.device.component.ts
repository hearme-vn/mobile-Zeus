import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { ChartData, HMChartOptions } from '@app/_models';
import { BaseReport } from '@app/_bases/basereport.component';
import { PieChartComponent } from '@app/_bases/charts';
import { Device } from '@app/_models';

@Component({
  selector: 'feedbackcount-bydevice-report',
  template: `
      <hm-piechart #feedbacks_bydevice 
        [style] = "styleData"
        [data]="chartData"
        [labels]="chartLabels"
        [hm_options]="hmoptions">
      </hm-piechart>
  `
})
export class FeedbacksByDevice extends BaseReport {
  statistics_url = this.app_service.Based_URLs.front + URIS.front.fbcount_count_by_devices;

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * Get all group in system
  */
  loadObjectList() {
    let filterParams = { status: 100 };
    return this.loadObjectsbyFilter(Device, filterParams);
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(reportData) {
    this.hmoptions = new HMChartOptions({"title_text": this.translate.instant('DASHBOARD.FEEDBACKS_BY_DEVICE_CHART_TITLE')});
    
    // console.log("Report data: ", reportData);
    this.resetChartData();

    if (!reportData || !reportData.length)      return;
    this.loadObjectList().subscribe(
      function(objects) {
        let chartData = [];
        let chartLabels = [];

        // console.log("Device list", objects)
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
          // Group count
          chartData.push(object_report.count);

          // Group name
          let object = object_map[object_report.device_id];
          if (object)
            chartLabels.push(object.name)
          else
            chartLabels.push(object_report.device_id);
        }  
        this.chartData = chartData;
        this.chartLabels = chartLabels;        
      }.bind(this)
    )
  }

}

