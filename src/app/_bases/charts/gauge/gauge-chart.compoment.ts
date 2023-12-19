import { Component, Input } from '@angular/core';
import { BaseChartComponent } from '@app/_bases';
import { GaugeChartOptions } from '@app/_models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hm-gaugechart',
  styleUrls: ['gauge-chart.compoment.css'],
  templateUrl: 'gauge-chart.compoment.html'
})
export class GaugeChartComponent extends BaseChartComponent {
  @Input('data')    data: number;             // Contain value for gauge needle
  @Input('label')  chartLabel: String;  // Label under chart
  @Input('options')   gaugeOptions: GaugeChartOptions;                     // Chart options
  @Input('type')   chartType: string = "arch";     // Chart type "full", "semi", "arch"

  // constructor (public translate: TranslateService) {
  //   super();
  // }

  /**
   * Update data for gauge chart
   */
  public updateChart(): void {
    // console.log("Gauge chart options: ", this.gaugeOptions);
    if (!this.gaugeOptions)   this.gaugeOptions = new GaugeChartOptions();

    let chartValue = this.data + this.gaugeOptions.bias;
    if (chartValue < 0)   chartValue = 0;

    this.gaugeOptions.markers[String(chartValue)] = { color: "#555", type: "triangle", size: 10 };
  }  
}
