import { Component, Input } from '@angular/core';
import { BaseChartComponent } from '@app/_bases';
import { GaugeChartOptions, NumberChartOptions } from '@app/_models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hm-numberchart',
  styleUrls: ['number-chart.compoment.css'],
  templateUrl: 'number.template.html'
})
export class NumberChartComponent extends BaseChartComponent {

  @Input('data')    data;               // Contain value for gauge needle
  @Input('label')  chartLabel: String;  // Label under chart
  @Input('options')   numberChartOptions: NumberChartOptions;    // Gauge chart options
  @Input('cssClass')   cssClass = "callout callout-success";

  constructor (public translate: TranslateService) {
    super();
  }


  /**
   * Update data for line chart
   */
  public updateChart(): void {
  }

}
