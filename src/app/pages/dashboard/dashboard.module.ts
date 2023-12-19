import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { OnboardingComponent } from './onboarding.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
// import { TranslateModule } from '@ngx-translate/core';
import { HMReportsModule } from '@app/_bases/reports';
import { HMChartdModule } from '@app/_bases/charts/chart.module';
import { SharedModule } from '@app/_bases/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    DashboardRoutingModule,
    ButtonsModule.forRoot(),
    HMReportsModule,
    HMChartdModule
  ],
  declarations: [ 
    DashboardComponent, 
    OnboardingComponent
  ]
})
export class DashboardModule { }
