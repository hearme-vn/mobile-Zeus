import {Component, Injector, Input, ViewChild} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { ChartDataSets } from 'chart.js';
import { HMChartOptions } from '@app/_models';

@Component({
  selector: 'emails-bytime-report',
  template: `
    <hm-barchart
      [style] = "styleData"
      [data]="chartData"
      [labels]="chartLabels"
      [options]="barChartOptions"
      [hm_options]="hmoptions">
    </hm-barchart>
  `
})
export class EmailsByTime extends BaseReport {
  statistics_url = this.app_service.Based_URLs.main + URIS.main.email_counting_by_time_series;

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(reportData) {
    this.hmoptions = new HMChartOptions({"title_text": this.translate.instant('DASHBOARD.EMAIL_CHART_TITLE')});

    this.resetChartData();
    if (!reportData || !reportData.length)    return;

    // console.log("Report data: ", reportData);
    this.chartLabels = this.makeLabels(this.filter_data.fixed_time);

    const emailData: ChartDataSets = {
      label: this.translate.instant('DASHBOARD.EMAIL_CHART_FB'),
      data: []
    };
    const mapEmailData = [];
    for (let i = 0; i < reportData.length; i++) {
      mapEmailData[reportData[i].time] = reportData[i].count;
    }
    for (let i = 0; i < this.chartLabels.length; i++) {
      if (mapEmailData[this.chartLabels[i]] !== undefined) {
        emailData.data.push(mapEmailData[this.chartLabels[i]]);
      } else {
        emailData.data.push(0);
      }
    }
    // this.chartData = [];
    this.chartData.push(emailData);
  }

}

