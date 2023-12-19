import {Component, Input, ViewChild} from '@angular/core';
import {BaseChartComponent} from '@app/_bases';
import {TranslateService} from '@ngx-translate/core';
import {hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import * as pluginLabels from 'chartjs-plugin-labels';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'hm-barchart',
  styleUrls: ['../chart.template.css'],
  templateUrl: '../chart.template.html'
})
export class BarChartComponent extends BaseChartComponent {
  chartType = 'bar';  

  constructor (public translate: TranslateService) {
    super();
  }

  public chartOptions: ChartOptions = {
    // indexAxis: 'y',
    // scaleShowVerticalLines: false,
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
      labels: {
        render: 'value',
        precision: 0
      }
    }    
  };

  public pieChartPlugins = [pluginLabels];

  /**
   * Update data for line chart
   */
  public updateChart(): void {
    // for (let i = 0; i < this.datasets.length; i++) {
    //   this.datasets[i].backgroundColor = hexToRgba(this.CHART_COLORS[i], 70);
    //   this.datasets[i].borderColor = this.CHART_COLORS[i];
    //   this.datasets[i].pointHoverBackgroundColor = '#fff';
    // }

    if (this.options)   this.chartOptions = this.options;

  }  
}
