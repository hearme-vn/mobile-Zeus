import {Component, Injector} from '@angular/core';
import { URIS } from '@app/_services';
import { BaseReport } from '@app/_bases/basereport.component';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { HMChartOptions } from '@app/_models';

@Component({
  selector: 'customers-bytime-report',
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
export class CustomersByTime extends BaseReport {
  // chartData: ChartDataSets[] = [];
  // chartLabels = [];   // Array of label in X axis
  
  statistics_url = this.app_service.Based_URLs.main + URIS.main.customer_counting_by_time_series;

  constructor (public injector: Injector) {
    super(injector);
  }

  /**
   * Process data to insert into chart
  */  
  dataProcesssing(reportData) {
    this.hmoptions = new HMChartOptions({"title_text": this.translate.instant('DASHBOARD.CUSTOMER_CHART_TITLE')});
    
    this.resetChartData();
    if (!reportData || !reportData.length)    return;
    
    // console.log("Report data: ", reportData);
    this.chartLabels = this.makeLabels(this.filter_data.fixed_time);

    const chartData: ChartDataSets = {
      label: this.translate.instant('DASHBOARD.CUSTOMER_CHART_FB'),
      data: []
    };
    const maplData = [];
    for (let i = 0; i < reportData.length; i++) {
        maplData[reportData[i].time] = reportData[i].count;
    }
    for (let i = 0; i < this.chartLabels.length; i++) {
      if (maplData[this.chartLabels[i]] !== undefined) {
        chartData.data.push(maplData[this.chartLabels[i]]);
      } else {
        chartData.data.push(0.0);
      }
    }
    this.chartData = [];
    this.chartData.push(chartData);
  }

}

