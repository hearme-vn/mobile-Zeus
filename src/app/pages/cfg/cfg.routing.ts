import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLanguageComponent, ConfigurationComponent, PosNhanhPageComponent, 
  ReportPluginsComponent, FeedbackPluginsComponent } from '.';

let routes: Routes = [
  {
    path: 'default-language',
    component: DefaultLanguageComponent,
    data: {
      title_key: 'SIDEBAR.DEVICE_LANGUAGE'
    }
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    data: {
      title_key: 'SIDEBAR.SYSTEM_CONFIGURATION'
    }
  },
  {
    path: 'pos-nhanh-page',
    component: PosNhanhPageComponent,
    data: {
      title_key: 'SIDEBAR.POS_NHANH_PAGE'
    }
  },
  {
    path: 'report-plugins',
    component: ReportPluginsComponent,
    data: {
      title_key: 'SIDEBAR.REPORT_PLUGINS'
    }
  },
  {
    path: 'feedback-plugins',
    component: FeedbackPluginsComponent,
    data: {
      title_key: 'SIDEBAR.FEEDBACK_PLUGINS'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CfgRouting {}

