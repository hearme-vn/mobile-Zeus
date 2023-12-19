import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {BaseChartComponent} from '@app/_bases';
import {TranslateService} from '@ngx-translate/core';
import { ChartConfiguration, ChartDataSets } from 'chart.js';
import * as pluginLabels from 'chartjs-plugin-labels';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 20 Dec 2022
 * @purpose Simple Pie chat component - with only one dataset
 * @input datasets(data input): is just array of Numbers for items
 * @input labels: is array of string for items
 */
@Component({
  selector: 'hm-piechart',
  styleUrls: ['chart.template.css'],
  templateUrl: 'chart.template.html'
})
export class PieChartComponent extends BaseChartComponent {
  /** This is thredhold - in percentage - that smaller pie will be move to Other group */
  static CUTOUT_PERCENTAGE = 10;
  /** Indicate whether component will cutoff small data. Default is true */
  @Input()   cutoff = true;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 20
      }
    },
    plugins: {
      labels: [
        // {
        //   render: 'label',
        //   position: 'outside',
        //   fontColor: this.CHART_COLORS
        // },
        {
          render: 'percentage',
          fontColor: 'white',
        }
      ]
    }
  };
  
  public chartPlugins = [pluginLabels];
  
  public chartType = 'pie';

  constructor (public translate: TranslateService) {
    super();
  }

  /**
   * Set dataset for pie chart
  */
  updateChart() {
    if (!this.datasets || !this.datasets.length)  return;
    // Check if dataset is array of ChartDataSets[], then return without processing
    if (typeof this.datasets[0] !== 'number') {
      return
    }

    // Convert array of number to datasets: ChartDataSets[]
    let data = this.datasets;
    if (data && data.length) {
      if (!this.cutoff) {
        // Assign dataset
        this.datasets = [{
          data: <[]>data,
          backgroundColor: this.CHART_COLORS
        }]
        return;
      }

      // Merg small pie into Other pie
      let new_data = this.cleanPieData(<[]>data, this.chartLabels);

      // Assign dataset
      this.datasets = [{
        data: new_data.data,
        backgroundColor: this.CHART_COLORS
      }]
      // this.data = null;
      this.chartLabels = <[]>new_data.labels;
    } else
      this.datasets = null;
  }

  /**
   * Clean data
   * - Combile some small pies (if number of small pies >= 2) into a group Other
   * - Return in new structur data
  */
  cleanPieData(data: number[], labels: string[]) {
    let dataset = {data: [], labels: []};

    if (!data || !data.length)   return dataset;
    // Get sum of all chart data
    const valueSum = data.reduce((a, b) => a + b, 0);
    // Store number of small pie and total data
    let acc = {
      count: 0, 
      total: 0
    };
    data.map( (item, i ) => {
      let percentage = 100* item / valueSum;
      if (percentage < PieChartComponent.CUTOUT_PERCENTAGE) {
        // Small pie, put into accummulator
        acc.count += 1;
        acc.total += item;
      } else {
        // put into output data
        dataset.data.push(item);
        dataset.labels.push(labels[i]);
      }
    });
    if (acc.count < 2) {
      // Keep original data
      return { data: data, labels: labels }
    } else {
      // Make other label
      let other_label = "Others";
      dataset.data.push(acc.total);
      dataset.labels.push(other_label);
      return dataset;
    }


  }

}
