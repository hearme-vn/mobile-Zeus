import { Component } from '@angular/core';
import { BaseChartComponent } from '@app/_bases';
import { TranslateService } from '@ngx-translate/core';
import { ChartOptions } from 'chart.js';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 16 Dec 2020
 * @purpose This component is for Horizontal bar chart types
 */

@Component({
  selector: 'hm-horizontalbarchart',
  styleUrls: ['hm-horizontalbarchart.component.css'],
  templateUrl: 'horizontalbar-chart.compoment.html'
})
export class HorizontalBarChartComponent extends BaseChartComponent {

  default_horizontal_barchart_options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
            suggestedMin: 0,
            suggestedMax: 100
        }
      }]
    }    
  };

  constructor (public translate: TranslateService) {
    super();

    // this.options = this.default_chartOptions;
  }

  /**
   * Update chart data here
   */
  updateChart() {
    if (!this.options) {
      // Get Min, max values

      // Assign options
      this.options = <any>this.default_horizontal_barchart_options;
    }
    // console.log("Chart options: ", this.options);
  }
 
}
