import { SharedModule } from '@app/_bases/shared.module';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HMUIsModule } from '@app/_bases/ui';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent, FeedbackDetailComponent } from '.';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

@NgModule({
  imports: [
    SharedModule,
    FeedbackRoutingModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    HMUIsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [ 
    FeedbackComponent, FeedbackDetailComponent
  ]
})
export class FeedbackModule { }
