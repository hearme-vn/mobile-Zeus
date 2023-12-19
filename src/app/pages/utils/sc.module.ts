import { NgModule } from  '@angular/core';
import { SharedModule } from '@app/_bases/shared.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { WelcomeComponent } from './welcome.component';
import { SCRouting } from './sc.routing';
import { NotificationComponent } from '@app/pages/utils/notification.component';

/**
 * This module is Support Components
 * */ 
@NgModule({
  imports: [
    SharedModule,
    SCRouting,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ WelcomeComponent, NotificationComponent ]
})
export class SCModule { }

