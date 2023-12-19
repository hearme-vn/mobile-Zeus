import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HMUIsModule } from '@app/_bases/ui';
import { HMCommonModule } from '@app/_bases/common'; 
import { CreateSurveyComponent } from './create.component';
import { SurveyComponent } from './survey.component';
import { SurveyRouting } from './survey.routing';
import { ImportSurveyComponent } from './import.component';

@NgModule({
  imports: [
    SharedModule,
    SurveyRouting,
    HMUIsModule,
    DragDropModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    HMCommonModule
  ],
  declarations: [ SurveyComponent, CreateSurveyComponent, ImportSurveyComponent ]
})
export class SurveyModule { }

