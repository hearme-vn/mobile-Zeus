import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyAnalysisComponent, RelationAnalysisComponent, PluginReportComponent } from '.'; 

const routes: Routes = [
  {
    path: 'survey',
    component: SurveyAnalysisComponent,
    data: {
      title_key: 'SIDEBAR.SURVEY_ANALYSIS'
    }
  },
  {
    path: 'relation',
    component: RelationAnalysisComponent,
    data: {
      title_key: 'SIDEBAR.CORRELATION_ANALYSIS'
    }
  },
  {
    path: 'plugins',
    component: PluginReportComponent,
    data: {
      title_key: 'SIDEBAR.PLUGINS_ANALYSIS'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
