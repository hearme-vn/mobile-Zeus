import { Component } from '@angular/core';
import { BaseChartComponent } from '@app/_bases';

/**
 * @license hearme 
 * @copyright 2017-2022 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 16 Dec 2020
 * @purpose This component is general hearme chart for all chart types
 * This chart adds some html elements to base chart: import/export, download, switch between chart and data table....
*/

@Component({
  selector: 'hm-chart',
  styleUrls: ['hm-chart.component.css'],
  templateUrl: 'hm-chart.component.html'
})
export class HMChartComponent extends BaseChartComponent {

}
