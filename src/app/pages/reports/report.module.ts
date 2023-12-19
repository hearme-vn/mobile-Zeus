import { SharedModule } from '@app/_bases/shared.module';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ReportRoutingModule } from './report-routing.module';
import { SurveyAnalysisComponent, RelationAnalysisComponent, PluginReportComponent } from '.'; 
import { HMUIsModule } from '@app/_bases/ui';
import { HMReportsModule } from '@app/_bases/reports';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgSelectModule } from '@ng-select/ng-select';
import { HMCommonModule } from '@app/_bases/common';

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule,
    HMReportsModule,
    HMUIsModule,
    NgSelectModule,
    HMCommonModule,
    TooltipModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [ 
    SurveyAnalysisComponent,
    RelationAnalysisComponent,
    PluginReportComponent
  ]
})
export class ReportModule { }
