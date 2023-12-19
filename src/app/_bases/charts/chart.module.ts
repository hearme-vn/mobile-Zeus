import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxGaugeModule } from 'ngx-gauge';
import { GoogleChartsModule } from 'angular-google-charts';

import { PieChartComponent } from './pie-chart.compoment';
import { LineChartComponent } from './line-chart.compoment';
import { BarChartComponent } from './bar/bar-chart.compoment';
import { HorizontalBarChartComponent } from './bar/horizontalbar-chart.compoment';
import { GaugeChartComponent } from './gauge/gauge-chart.compoment';
import { NumberChartComponent } from './number/number-chart.compoment';
import { HMChartComponent } from './hm-chart.component';
import { GoogleChartsComponent } from './google-charts/google-charts.compoment';


let charts = [
  PieChartComponent, LineChartComponent, BarChartComponent, HorizontalBarChartComponent, 
  HMChartComponent, GaugeChartComponent, NumberChartComponent, GoogleChartsComponent
]
@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NgOptionHighlightModule,
    NgxGaugeModule,
    GoogleChartsModule,
    TranslateModule
  ],
  declarations: charts,
  exports: charts
})
export class HMChartdModule { }
