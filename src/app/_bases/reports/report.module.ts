import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';

import { HMChartdModule } from '@app/_bases/charts/chart.module';
import { CorrelationAnalysis } from './correlations/correlations.component';

import { SurveyCSATReport } from './CSAT/survey.csat.component';
import { SurveyCESReport } from './CES/survey.ces.component';
import { SurveyOtherReport } from './survey_others/survey.others.component';

import { FeedbacksByDevice } from './feedbacksByDevice/feedbacks.by.device.component';
import { FeedbacksByGroup } from './feedbacksByGroup/feedbacks.by.group.component';
import { FeedbacksBySurvey } from './feedbacksBySurvey/feedbacks.by.survey.component';
import { FeedbacksByTime } from './feedbackByTimes/feedbacks.by.time.component';
import { EmailsByTime } from './emailCount/email.count.component';
import { CustomersByTime } from './customerCount/customer.count.component';
import { SurveyNPSReport } from './NPS/survey.nps.component';
import { SurveyFLXReport } from './FLX/survey.flx.component';
import { SurveySingleSelectionReport } from './single_selection/survey.single_selection.component';
import { SurveyMultiSelectionReport } from './multi_selection/survey.multi_selection.component';
import { Survey5StarReport } from './rating/survey.rating.component'; 

let component_list = [
  FeedbacksByDevice, FeedbacksByGroup, FeedbacksBySurvey, FeedbacksByTime, EmailsByTime, CustomersByTime,
  CorrelationAnalysis, SurveyCSATReport, SurveyOtherReport, SurveyCESReport, SurveyNPSReport, SurveyFLXReport,
  SurveySingleSelectionReport, SurveyMultiSelectionReport, Survey5StarReport
]

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HMChartdModule
  ],
  declarations: component_list,
  exports: component_list
})
export class HMReportsModule { }
