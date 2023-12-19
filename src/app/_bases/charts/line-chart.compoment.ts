import {Component, Input, ViewChild} from '@angular/core';
import {hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {BaseChartComponent} from '@app/_bases';
import {TranslateService} from '@ngx-translate/core';
import { ChartConfiguration, ChartDataSets, ChartTooltipLabelColor } from 'chart.js';

@Component({
  selector: 'hm-linechart',
  styleUrls: ['chart.template.css'],
  templateUrl: 'line-chart.template.html'
})
export class LineChartComponent extends BaseChartComponent {
  chartType = 'line';

  constructor (public translate: TranslateService) {
    super();
  }

  public chartOptions: ChartConfiguration['options']  = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return <ChartTooltipLabelColor>{ backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
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
          beginAtZero: true
          // userCallback: function(label, index, labels) {
          //   // when the floored value is the same as the value we have a whole number
          //   if (Math.floor(label) === label) {
          //     return label;
          //   }

          // },
          // maxTicksLimit: 5,
          // stepSize: Math.ceil(250 / 5),
          // max: 250
        }
      }]
    },

    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: true,
      align: 'end',
      fullWidth: true,
      labels: {
        boxWidth: 20
      }
    }
    // fill: true,
  };

  /**
   * Update data for line chart
   */
  public updateChart(): void {
    for (let i = 0; i < this.datasets.length; i++) {
      // this.datasets[i].label = this.translate.instant(this.datasets[i].label);
      this.datasets[i].backgroundColor = hexToRgba(this.CHART_COLORS[i], 10);
      this.datasets[i].borderColor = this.CHART_COLORS[i];
      this.datasets[i].pointHoverBackgroundColor = '#fff';

    }

    if (this.options)   this.chartOptions = this.options;
  }

}
