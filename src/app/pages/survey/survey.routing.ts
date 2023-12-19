import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyComponent } from './survey.component';
import { CreateSurveyComponent } from './create.component';
import { ImportSurveyComponent } from './import.component';

const routes: Routes = [

// let routes: Routes = [
  {
    path: 'list',
    component: SurveyComponent,
    data: {
      title_key: 'SIDEBAR.SURVEY'
    }
  },
  {
    path: 'create',
    component: CreateSurveyComponent,
    data: {
      title_key: 'SIDEBAR.SURVEY_CREATE'
    }
  },
  {
    path: 'edit',
    component: CreateSurveyComponent,
    data: {
      title_key: 'SIDEBAR.SURVEY_EDIT'
    }
  },
  {
    path: 'import',
    component: ImportSurveyComponent,
    data: {
      title_key: 'SIDEBAR.SURVEY_IMPORT'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRouting {}

