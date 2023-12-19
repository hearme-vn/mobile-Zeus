import { Component, Input } from '@angular/core';
import { BaseChartComponent } from '@app/_bases';
import { GaugeChartOptions } from '@app/_models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hm-googlecharts',
  styleUrls: ['google-charts.compoment.css'],
  templateUrl: 'google-charts.compoment.html'
})
export class GoogleChartsComponent extends BaseChartComponent {
  @Input('data')    data: any = null;             // Contain value for chart
  @Input('label')  chartLabel: String;  // Label under chart
  @Input('type')   chartType: string = "Gauge";     // Google Chart type

  /**
   * Update data for chart
   */
  public updateChart(): void {
    // console.log("Gauge chart options: ", this.gaugeOptions);
    // this.options = <any>{
    //     width: 400,
    //     height: 120,
    //     greenFrom: 0,
    //     greenTo: 75,
    //     redFrom: 90,
    //     redTo: 100,
    //     yellowFrom: 75,
    //     yellowTo: 90,
    //     minorTicks: 5
    //   }
  }  
}
