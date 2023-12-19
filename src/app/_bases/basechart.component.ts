// Angular libraries
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HMChartOptions } from '@app/_models';

import { ChartConfiguration, ChartDataSets } from 'chart.js';

/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 18 Oct 2022
 * @purpose Base chart component for hearme chart.
 * Chart is for displaying data in UI, export, download
 */

/**
 * Purpose: Base chart Component for charts in reports
*/
@Component({
  selector: 'base-chart',
  template: `
    <div class="chart-wrapper" [style]="containerStyle" >
      <canvas baseChart class="innerClass" *ngIf="datasets && datasets.length"
        [datasets]="datasets"
        [labels]="chartLabels"        
        [options]="options"
        [chartType]="chartType">
      </canvas>
    </div>
  `
})
class BaseChartComponent implements OnInit, OnChanges {
  static CHART_COLORS = ['#3366CC', '#06b110', '#FF6A68', '#FF9900', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

  public CHART_COLORS = BaseChartComponent.CHART_COLORS;
  public innerClass = "hm_chart"

  public default_chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any, index) {
            return index % 2 === 0 ? value : '';
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          // userCallback: function(label, index, labels) {
          //   // when the floored value is the same as the value we have a whole number
          //   if (Math.floor(label) === label) {
          //     return label;
          //   }
          // },
        }
      }]
    },
    legend: {
      display: true,
      align: 'end',
      labels: {
        boxWidth: 20
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'left',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };

  @Input('style')   containerStyle = '';
  @Input('data')    datasets: ChartDataSets[] = [];             // Contain data for each data set, name, and color
  @Input('labels')  chartLabels: Array<any> = [];               // Label for x axis
  @Input()   options: ChartConfiguration['options'];    // Chart options - for ChartJS
  @Input('type')   chartType: string;                   // Chart type
  @Input('plugins')   chartPlugins;
  @Input('hm_options')   hm_options: HMChartOptions;    // Options over chart

  static chart_types = {
    "BAR_CHART": "bar",
    "LINE_CHART": "line",
    "PIE_CHART": "pie",
    "HORIZONTAL_BARCHART": "horizontalBar"    
  }
  /**
   * Processing when hover chart
  */
  chartHovered(event) {}

  /**
   * Processing when click chart
  */
  chartClicked(event) {}

  /**
   * Update chart data here
   */
  updateChart() {}

  /**
   * Init chart data here
   */
  ngOnInit(): void {
    // this.updateChart();
  }  

  ngOnChanges(): void {
    this.updateChart();
    // if (!this.options)  this.options = this.default_chartOptions;
  }

}

export { BaseChartComponent };
